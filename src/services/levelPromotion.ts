export interface LevelRequirement {
  id: string;
  name: string;
  requiredReferrals: number;
  requiredActiveClients: number;
  commissionRate: number; // percentage per liter
  autoPromotion: boolean;
}

export interface Influencer {
  id: number;
  name: string;
  currentLevel: string;
  referrals: number;
  activeClients: number;
  networkPurchases: number; // total liters purchased by network
  nextLevel: string;
  progress: number;
}

export interface PromotionResult {
  influencerId: number;
  oldLevel: string;
  newLevel: string;
  promoted: boolean;
  reason: string;
  requirementsMet: {
    referrals: boolean;
    activeClients: boolean;
  };
}

export class LevelPromotionService {
  private levelRequirements: LevelRequirement[] = [
    {
      id: "silver",
      name: "Silver",
      requiredReferrals: 20,
      requiredActiveClients: 15,
      commissionRate: 20, // 20% per liter
      autoPromotion: true
    },
    {
      id: "gold",
      name: "Gold",
      requiredReferrals: 50,
      requiredActiveClients: 35,
      commissionRate: 30, // 30% per liter
      autoPromotion: true
    },
    {
      id: "platinum",
      name: "Platinum",
      requiredReferrals: 100,
      requiredActiveClients: 75,
      commissionRate: 40, // 40% per liter
      autoPromotion: true
    }
  ];

  // Get all level requirements
  getLevelRequirements(): LevelRequirement[] {
    return this.levelRequirements;
  }

  // Update level requirements
  updateLevelRequirements(requirements: LevelRequirement[]): void {
    this.levelRequirements = requirements;
  }

  // Check if an influencer meets requirements for a specific level
  checkLevelEligibility(influencer: Influencer, targetLevel: string): boolean {
    const level = this.levelRequirements.find(l => l.id === targetLevel);
    if (!level) return false;

    return (
      influencer.referrals >= level.requiredReferrals &&
      influencer.activeClients >= level.requiredActiveClients
    );
  }

  // Get the next level an influencer should achieve
  getNextLevel(influencer: Influencer): string | null {
    const currentLevelIndex = this.levelRequirements.findIndex(l => 
      l.name.toLowerCase() === influencer.currentLevel.toLowerCase()
    );
    
    if (currentLevelIndex === -1 || currentLevelIndex === this.levelRequirements.length - 1) {
      return null; // Already at max level or level not found
    }

    return this.levelRequirements[currentLevelIndex + 1].name;
  }

  // Calculate progress towards next level
  calculateProgress(influencer: Influencer): number {
    const nextLevel = this.getNextLevel(influencer);
    if (!nextLevel) return 100; // Already at max level

    const level = this.levelRequirements.find(l => l.name === nextLevel);
    if (!level) return 0;

    const referralProgress = Math.min(influencer.referrals / level.requiredReferrals, 1);
    const clientProgress = Math.min(influencer.activeClients / level.requiredActiveClients, 1);

    // Average progress across referral and client requirements
    return Math.round(((referralProgress + clientProgress) / 2) * 100);
  }

  // Check if influencer should be automatically promoted
  shouldPromote(influencer: Influencer): PromotionResult {
    const nextLevel = this.getNextLevel(influencer);
    if (!nextLevel) {
      return {
        influencerId: influencer.id,
        oldLevel: influencer.currentLevel,
        newLevel: influencer.currentLevel,
        promoted: false,
        reason: "Already at maximum level",
        requirementsMet: {
          referrals: true,
          activeClients: true
        }
      };
    }

    const level = this.levelRequirements.find(l => l.name === nextLevel);
    if (!level || !level.autoPromotion) {
      return {
        influencerId: influencer.id,
        oldLevel: influencer.currentLevel,
        newLevel: influencer.currentLevel,
        promoted: false,
        reason: "Auto promotion disabled for this level",
        requirementsMet: {
          referrals: influencer.referrals >= level.requiredReferrals,
          activeClients: influencer.activeClients >= level.requiredActiveClients
        }
      };
    }

    const requirementsMet = {
      referrals: influencer.referrals >= level.requiredReferrals,
      activeClients: influencer.activeClients >= level.requiredActiveClients
    };

    const allRequirementsMet = Object.values(requirementsMet).every(met => met);

    if (allRequirementsMet) {
      return {
        influencerId: influencer.id,
        oldLevel: influencer.currentLevel,
        newLevel: nextLevel,
        promoted: true,
        reason: `All requirements met for ${nextLevel} level`,
        requirementsMet
      };
    } else {
      return {
        influencerId: influencer.id,
        oldLevel: influencer.currentLevel,
        newLevel: influencer.currentLevel,
        promoted: false,
        reason: `Requirements not yet met for ${nextLevel} level`,
        requirementsMet
      };
    }
  }

  // Process automatic promotions for all influencers
  processAutomaticPromotions(influencers: Influencer[]): PromotionResult[] {
    return influencers.map(influencer => this.shouldPromote(influencer));
  }

  // Get influencers ready for promotion
  getInfluencersReadyForPromotion(influencers: Influencer[]): Influencer[] {
    return influencers.filter(influencer => {
      const result = this.shouldPromote(influencer);
      return result.promoted;
    });
  }

  // Get influencers close to promotion (80%+ progress)
  getInfluencersCloseToPromotion(influencers: Influencer[]): Influencer[] {
    return influencers.filter(influencer => {
      const progress = this.calculateProgress(influencer);
      return progress >= 80 && progress < 100;
    });
  }

  // Update influencer level (this would typically call an API)
  async promoteInfluencer(influencerId: number, newLevel: string): Promise<boolean> {
    try {
      // Simulate API call
      console.log(`Promoting influencer ${influencerId} to ${newLevel}`);
      
      // In a real implementation, this would:
      // 1. Call the backend API to update the influencer's level
      // 2. Update commission rates
      // 3. Send notification to the influencer
      // 4. Log the promotion for audit purposes
      
      return true;
    } catch (error) {
      console.error(`Failed to promote influencer ${influencerId}:`, error);
      return false;
    }
  }
}

// Export singleton instance
export const levelPromotionService = new LevelPromotionService();
