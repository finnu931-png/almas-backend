const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', requireUser, async (req, res) => {
  try {
    console.log('GET /api/analytics/dashboard - Fetching dashboard analytics');

    // Mock analytics data
    const analyticsData = {
      totalLeads: 150,
      newLeads: 25,
      qualifiedLeads: 45,
      closedDeals: 12,
      revenue: 125000,
      conversionRate: 8.5,
      monthlyGrowth: 15.2,
      activeClients: 89
    };

    res.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error in GET /api/analytics/dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard analytics',
      message: error.message
    });
  }
});

// GET /api/analytics - Get general analytics
router.get('/', requireUser, async (req, res) => {
  try {
    console.log('GET /api/analytics - Fetching general analytics');

    // Mock analytics data
    const analyticsData = {
      websiteTraffic: {
        pageViews: 12500,
        uniqueVisitors: 8750,
        bounceRate: 35.2,
        avgSessionDuration: 180
      },
      leadGeneration: {
        totalLeads: 150,
        conversionRate: 8.5,
        leadSources: {
          website: 85,
          referral: 35,
          socialMedia: 20,
          emailCampaign: 10
        }
      },
      performance: {
        avgLoadTime: 1.2,
        errorRate: 0.5,
        uptime: 99.9
      }
    };

    res.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Error in GET /api/analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

module.exports = router;