export interface ClientPoints {
  clientId: string;
  phone: string;
  name: string;
  totalPoints: number;
  availablePoints: number;
  totalWaterPurchased: number; // in liters
  tier: string;
  joinDate: string;
}

export interface PointsTransaction {
  id: string;
  clientId: string;
  type: "earned" | "redeemed" | "bonus" | "giveaway";
  amount: number;
  description: string;
  date: string;
  waterPurchase?: number; // liters if earned from purchase
}

export interface GiveawayEntry {
  id: string;
  clientId: string;
  campaignId: string;
  campaignName: string;
  waterRequirement: number;
  waterPurchased: number;
  eligible: boolean;
  entryDate: string;
}

export class ClientPointsService {
  private pointsRate = 10; // points per liter of water purchased
  private tierMultipliers = {
    "Lead": 1.0,
    "Silver": 1.2,
    "Gold": 1.5,
    "Platinum": 2.0
  };

  // Calculate points earned from water purchase
  calculatePointsEarned(liters: number, tier: string): number {
    const basePoints = liters * this.pointsRate;
    const multiplier = this.tierMultipliers[tier as keyof typeof this.tierMultipliers] || 1.0;
    return Math.round(basePoints * multiplier);
  }

  // Check if client is eligible for a giveaway
  checkGiveawayEligibility(
    clientId: string, 
    waterRequirement: number, 
    timePeriod: number,
    startDate: string,
    endDate: string
  ): boolean {
    // This would typically query the database for actual purchase history
    // For now, return mock eligibility
    return Math.random() > 0.3; // 70% chance of being eligible
  }

  // Get clients eligible for a specific campaign
  getEligibleClients(
    waterRequirement: number,
    timePeriod: number,
    startDate: string,
    endDate: string
  ): ClientPoints[] {
    // Mock data - in real implementation, this would query the database
    return [
      {
        clientId: "1",
        phone: "+244 923 456 789",
        name: "Maria Silva",
        totalPoints: 1250,
        availablePoints: 800,
        totalWaterPurchased: 150,
        tier: "Silver",
        joinDate: "2024-01-15"
      },
      {
        clientId: "2",
        phone: "+244 934 567 890",
        name: "João Santos",
        totalPoints: 890,
        availablePoints: 450,
        totalWaterPurchased: 120,
        tier: "Lead",
        joinDate: "2024-02-20"
      }
    ].filter(client => client.totalWaterPurchased >= waterRequirement);
  }

  // Award points for water purchase
  awardPointsForPurchase(
    clientId: string, 
    liters: number, 
    tier: string
  ): PointsTransaction {
    const pointsEarned = this.calculatePointsEarned(liters, tier);
    
    return {
      id: Date.now().toString(),
      clientId,
      type: "earned",
      amount: pointsEarned,
      description: `Earned ${pointsEarned} points for purchasing ${liters}L of water`,
      date: new Date().toISOString(),
      waterPurchase: liters
    };
  }

  // Redeem points for water purchase
  redeemPoints(
    clientId: string, 
    points: number, 
    waterLiters: number
  ): PointsTransaction {
    return {
      id: Date.now().toString(),
      clientId,
      type: "redeemed",
      amount: -points,
      description: `Redeemed ${points} points for ${waterLiters}L of water`,
      date: new Date().toISOString()
    };
  }

  // Award bonus points for campaign participation
  awardBonusPoints(
    clientId: string, 
    points: number, 
    campaignName: string
  ): PointsTransaction {
    return {
      id: Date.now().toString(),
      clientId,
      type: "bonus",
      amount: points,
      description: `Bonus points for ${campaignName} campaign`,
      date: new Date().toISOString()
    };
  }

  // Get client points summary
  getClientPointsSummary(clientId: string): ClientPoints | null {
    // Mock data - in real implementation, this would query the database
    const clients: ClientPoints[] = [
      {
        clientId: "1",
        phone: "+244 923 456 789",
        name: "Maria Silva",
        totalPoints: 1250,
        availablePoints: 800,
        totalWaterPurchased: 150,
        tier: "Silver",
        joinDate: "2024-01-15"
      }
    ];

    return clients.find(c => c.clientId === clientId) || null;
  }

  // Get client transaction history
  getClientTransactions(clientId: string): PointsTransaction[] {
    // Mock data - in real implementation, this would query the database
    return [
      {
        id: "1",
        clientId,
        type: "earned",
        amount: 150,
        description: "Earned 150 points for purchasing 15L of water",
        date: "2024-01-20T10:30:00Z",
        waterPurchase: 15
      },
      {
        id: "2",
        clientId,
        type: "redeemed",
        amount: -100,
        description: "Redeemed 100 points for 10L of water",
        date: "2024-01-22T14:15:00Z"
      }
    ];
  }
}

// Export singleton instance
export const clientPointsService = new ClientPointsService();
