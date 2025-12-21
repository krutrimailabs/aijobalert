AI Job Alert Platform - API Documentation
Version: 1.0 | Base URL: https://api.aijobalert.com/v1
Last Updated: [Current Date]

TABLE OF CONTENTS
Authentication

Rate Limiting

Jobs API

Users API

Eligibility API

Notifications API

Content API

Admin API

Webhooks

Error Handling

1. AUTHENTICATION
API Keys
All requests require an API key in the header:

http
Authorization: Bearer your_api_key_here
JWT Authentication (For User Actions)
http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Getting API Keys
Sandbox Key: Free, limited to 100 requests/day

bash
curl -X POST https://api.aijobalert.com/v1/auth/api-key \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com", "purpose": "development"}'
Production Key: Contact sales@aijobalert.com

Scopes & Permissions
Scope	Description	Endpoints
jobs:read	Read job listings	GET /jobs, GET /jobs/:id
jobs:write	Create/update jobs	POST/PUT /jobs
users:read	Read user data	GET /users/profile
users:write	Update user data	PUT /users/profile
admin	Full access	All endpoints
2. RATE LIMITING
Limits by Tier
Plan	Requests/Minute	Daily Limit	Burst
Free	10	1,000	20
Basic	60	50,000	100
Pro	300	250,000	500
Enterprise	1,000	1,000,000	2,000
Headers in Response
http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1617235200
Example Response when Limited
json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please try again in 45 seconds.",
    "retry_after": 45
  }
}
3. JOBS API
3.1 Get Jobs List
http
GET /jobs
Query Parameters:
Parameter	Type	Required	Description
state	string	No	Filter by state (e.g., 'TS', 'MH')
education	string[]	No	Filter by education level
category	string[]	No	Filter by job category
page	number	No	Page number (default: 1)
limit	number	No	Items per page (default: 20, max: 100)
sort_by	string	No	Field to sort by (postDate, lastDate)
sort_order	string	No	asc or desc (default: desc)
Example Request:
bash
curl "https://api.aijobalert.com/v1/jobs?state=TS&education[]=graduate&page=1&limit=20" \
  -H "Authorization: Bearer your_api_key"
Example Response:
json
{
  "success": true,
  "data": [
    {
      "id": "job_abc123",
      "postName": "Bank of India Credit Officer",
      "recruitmentBoard": "Bank of India",
      "state": "All India",
      "totalVacancies": 514,
      "lastDate": "2026-01-05T23:59:59Z",
      "postDate": "2025-12-20T00:00:00Z",
      "education": ["graduate"],
      "category": ["banking"],
      "aiSummary": "Eligibility: Any Graduate...",
      "applyLink": "https://bankofindia.co.in/apply",
      "metadata": {
        "views": 1245,
        "applications": 324,
        "matchScore": 85
      }
    }
  ],
  "meta": {
    "total": 1245,
    "page": 1,
    "limit": 20,
    "pages": 63
  }
}
3.2 Get Single Job
http
GET /jobs/{id}
Example Response:
json
{
  "success": true,
  "data": {
    "id": "job_abc123",
    "postName": "Bank of India Credit Officer",
    "recruitmentBoard": "Bank of India",
    "advtNo": "Project No. 2025-26/01",
    "totalVacancies": 514,
    "lastDate": "2026-01-05T23:59:59Z",
    "postDate": "2025-12-20T00:00:00Z",
    "state": "All India",
    "education": ["graduate"],
    "category": ["banking"],
    "aiSummary": "Eligibility: Any Graduate with 60% marks. Age: 21-30 years. Selection: Online Exam + Interview.",
    "eligibilityDetails": {
      "text": "Detailed eligibility criteria...",
      "ageLimits": {
        "general": {"min": 21, "max": 30},
        "obc": {"relaxation": 3},
        "sc_st": {"relaxation": 5}
      },
      "educational": {
        "minimum": "Graduate",
        "percentage": 60,
        "subjects": ["Any"]
      }
    },
    "salaryStipend": "₹ 9,000 - 12,000 per month",
    "applyLink": "https://bankofindia.co.in/apply",
    "officialNotification": {
      "url": "https://storage.aijobalert.com/pdf/boi_notification.pdf",
      "size": 2456789,
      "pages": 24
    },
    "relatedJobs": ["job_def456", "job_ghi789"],
    "timeline": {
      "notification": "2025-12-20",
      "lastDate": "2026-01-05",
      "examDate": "2026-02-15",
      "resultDate": "2026-03-30"
    }
  }
}
3.3 Search Jobs
http
GET /jobs/search
Query Parameters:
Parameter	Type	Required	Description
q	string	Yes	Search query
fuzzy	boolean	No	Enable fuzzy search (default: true)
fields	string[]	No	Fields to search (default: all)
Example Request:
bash
curl "https://api.aijobalert.com/v1/jobs/search?q=engineer+telangana&fuzzy=true" \
  -H "Authorization: Bearer your_api_key"
3.4 Get Similar Jobs
http
GET /jobs/{id}/similar
Query Parameters:
Parameter	Type	Required	Description
limit	number	No	Number of similar jobs (default: 5)
algorithm	string	No	cosine or jaccard (default: cosine)
4. USERS API
4.1 User Registration
http
POST /users/register
Request Body:
json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone": "+919876543210",
  "profile": {
    "educationLevel": "graduate",
    "preferredState": "TS",
    "category": "general",
    "age": 25,
    "skills": ["Python", "SQL", "Communication"]
  }
}
Response:
json
{
  "success": true,
  "data": {
    "id": "user_xyz789",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profileComplete": 65
  }
}
4.2 User Login
http
POST /users/login
Request Body:
json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
4.3 Get User Profile
http
GET /users/profile
Headers:
http
Authorization: Bearer {user_jwt_token}
Response:
json
{
  "success": true,
  "data": {
    "id": "user_xyz789",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+919876543210",
    "profile": {
      "educationLevel": "graduate",
      "preferredState": "TS",
      "category": "general",
      "age": 25,
      "skills": ["Python", "SQL", "Communication"],
      "resume": {
        "url": "https://storage.aijobalert.com/resumes/user_xyz789.pdf",
        "lastUpdated": "2025-12-21T10:30:00Z"
      }
    },
    "preferences": {
      "notifications": {
        "email": true,
        "push": true,
        "whatsapp": false,
        "sms": false
      },
      "jobAlerts": {
        "frequency": "daily",
        "categories": ["engineering", "banking"],
        "minimumMatchScore": 70
      }
    },
    "stats": {
      "jobsApplied": 12,
      "jobsSaved": 24,
      "matchAccuracy": 85,
      "profileStrength": 90
    }
  }
}
4.4 Update User Profile
http
PUT /users/profile
Request Body:
json
{
  "name": "John Doe Updated",
  "profile": {
    "educationLevel": "postgraduate",
    "skills": ["Python", "SQL", "Communication", "Data Analysis"]
  },
  "preferences": {
    "notifications": {
      "whatsapp": true
    }
  }
}
4.5 Upload Resume
http
POST /users/resume
Content-Type: multipart/form-data
Form Data:
text
file: (binary PDF file)
Response:
json
{
  "success": true,
  "data": {
    "url": "https://storage.aijobalert.com/resumes/user_xyz789.pdf",
    "size": 1456789,
    "pages": 3,
    "parsedData": {
      "education": ["B.Tech Computer Science"],
      "experience": ["2 years as Software Engineer"],
      "skills": ["Python", "JavaScript", "React"],
      "extractedSuccessfully": true
    }
  }
}
5. ELIGIBILITY API
5.1 Check Eligibility
http
POST /eligibility/check
Request Body:
json
{
  "userId": "user_xyz789",
  "jobId": "job_abc123",
  "options": {
    "includeSuggestions": true,
    "calculateAlternatives": true
  }
}
Response:
json
{
  "success": true,
  "data": {
    "isEligible": true,
    "matchScore": 85,
    "breakdown": {
      "education": {
        "eligible": true,
        "score": 100,
        "details": "User has B.Tech, job requires Graduate"
      },
      "age": {
        "eligible": true,
        "score": 100,
        "details": "User is 25, required range is 21-30"
      },
      "category": {
        "eligible": true,
        "score": 100,
        "details": "User is General category"
      },
      "state": {
        "eligible": true,
        "score": 100,
        "details": "Job is All India, user from TS"
      },
      "experience": {
        "eligible": false,
        "score": 0,
        "details": "Job requires 3 years, user has 2 years"
      }
    },
    "missingRequirements": [
      "1 more year of experience"
    ],
    "suggestions": [
      "Consider applying after gaining more experience",
      "Look for junior positions with 2 years requirement"
    ],
    "alternateJobs": [
      {
        "id": "job_def456",
        "postName": "Junior Software Engineer",
        "matchScore": 95,
        "reason": "Requires only 2 years experience"
      }
    ]
  }
}
5.2 Batch Eligibility Check
http
POST /eligibility/batch
Request Body:
json
{
  "userId": "user_xyz789",
  "jobIds": ["job_abc123", "job_def456", "job_ghi789"],
  "limit": 10
}
Response:
json
{
  "success": true,
  "data": [
    {
      "jobId": "job_abc123",
      "isEligible": true,
      "matchScore": 85
    },
    {
      "jobId": "job_def456",
      "isEligible": true,
      "matchScore": 95
    },
    {
      "jobId": "job_ghi789",
      "isEligible": false,
      "matchScore": 45
    }
  ]
}
5.3 Get Eligibility Rules
http
GET /eligibility/rules/{jobId}
Response:
json
{
  "success": true,
  "data": {
    "jobId": "job_abc123",
    "rules": {
      "education": {
        "minimum": "graduate",
        "specific": ["B.Tech", "B.E", "B.Sc"],
        "percentage": 60
      },
      "age": {
        "general": {"min": 21, "max": 30},
        "obc": {"min": 21, "max": 33},
        "sc_st": {"min": 21, "max": 35},
        "pwd": {"min": 21, "max": 40}
      },
      "experience": {
        "required": true,
        "years": 3,
        "type": "relevant"
      },
      "nationality": "Indian",
      "physicalStandards": {
        "height": {"male": 170, "female": 157},
        "chest": {"male": {"min": 80, "expansion": 5}}
      }
    }
  }
}
6. NOTIFICATIONS API
6.1 Get User Notifications
http
GET /notifications
Query Parameters:
Parameter	Type	Required	Description
type	string	No	job, alert, update, system
read	boolean	No	Filter by read status
limit	number	No	Default: 20
Response:
json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "type": "job",
      "title": "New Engineering Job in Telangana",
      "message": "TSGENCO has released 50 vacancies for Junior Engineers",
      "data": {
        "jobId": "job_xyz123",
        "matchScore": 92
      },
      "priority": "high",
      "read": false,
      "createdAt": "2025-12-21T10:30:00Z",
      "actions": [
        {"label": "View Job", "url": "/jobs/job_xyz123"},
        {"label": "Check Eligibility", "action": "checkEligibility"}
      ]
    }
  ],
  "unreadCount": 5
}
6.2 Mark Notification as Read
http
POST /notifications/{id}/read
6.3 Mark All as Read
http
POST /notifications/read-all
6.4 Get Notification Preferences
http
GET /notifications/preferences
Response:
json
{
  "success": true,
  "data": {
    "channels": {
      "email": {
        "enabled": true,
        "frequency": "daily",
        "categories": ["job", "alert"]
      },
      "push": {
        "enabled": true,
        "categories": ["urgent", "deadline"]
      },
      "whatsapp": {
        "enabled": false,
        "categories": []
      },
      "sms": {
        "enabled": false,
        "categories": ["critical"]
      }
    },
    "jobAlerts": {
      "minimumMatchScore": 70,
      "categories": ["engineering", "banking"],
      "states": ["TS", "AP"],
      "educationLevels": ["graduate", "postgraduate"]
    },
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "07:00"
    }
  }
}
6.5 Update Preferences
http
PUT /notifications/preferences
Request Body:
json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "categories": ["job", "deadline"]
    }
  },
  "jobAlerts": {
    "minimumMatchScore": 80
  }
}
7. CONTENT API
7.1 Get Admit Cards
http
GET /content/admit-cards
Query Parameters:
Parameter	Type	Required	Description
jobId	string	No	Filter by job
state	string	No	Filter by state
fromDate	string	No	Start date (YYYY-MM-DD)
toDate	string	No	End date (YYYY-MM-DD)
Response:
json
{
  "success": true,
  "data": [
    {
      "id": "admit_123",
      "jobId": "job_abc123",
      "title": "SSC GD Constable Admit Card 2025",
      "downloadLink": "https://ssc.nic.in/admitcards/xyz.pdf",
      "examDate": "2026-01-15T09:00:00Z",
      "releaseDate": "2025-12-28T00:00:00Z",
      "instructions": [
        "Carry original ID proof",
        "Reach exam center 1 hour early",
        "No electronic devices allowed"
      ],
      "venue": {
        "name": "St. Joseph's College",
        "address": "123 College Road, Hyderabad",
        "mapUrl": "https://maps.google.com/?q=..."
      },
      "metadata": {
        "views": 12500,
        "downloads": 8900
      }
    }
  ]
}
7.2 Get Results
http
GET /content/results
Response:
json
{
  "success": true,
  "data": [
    {
      "id": "result_456",
      "jobId": "job_def456",
      "title": "IBPS RRB PO Result 2025",
      "downloadLink": "https://ibps.in/results/rrb-po-2025.pdf",
      "resultDate": "2025-12-20T00:00:00Z",
      "type": "preliminary",
      "cutoff": {
        "general": 65.5,
        "obc": 62.5,
        "sc": 58.5,
        "st": 55.5
      },
      "nextStage": {
        "type": "mains",
        "date": "2026-01-30T00:00:00Z"
      }
    }
  ]
}
7.3 Get Previous Papers
http
GET /content/previous-papers
Query Parameters:
Parameter	Type	Required	Description
exam	string	Yes	Exam name (e.g., 'SSC CGL')
year	number	No	Specific year
subject	string	No	Subject/topic
Response:
json
{
  "success": true,
  "data": [
    {
      "id": "paper_789",
      "exam": "SSC CGL",
      "year": 2024,
      "title": "SSC CGL Tier-I 2024 Question Paper",
      "downloadLink": "https://storage.aijobalert.com/papers/ssc-cgl-2024.pdf",
      "solutionLink": "https://storage.aijobalert.com/solutions/ssc-cgl-2024-sol.pdf",
      "subjects": ["Quantitative Aptitude", "English", "Reasoning", "General Awareness"],
      "questions": 100,
      "duration": 60,
      "difficulty": "moderate",
      "metadata": {
        "downloads": 24500,
        "averageScore": 65.5
      }
    }
  ]
}
7.4 Get Syllabus
http
GET /content/syllabus/{exam}
Response:
json
{
  "success": true,
  "data": {
    "exam": "SSC CGL",
    "title": "SSC Combined Graduate Level Syllabus",
    "lastUpdated": "2025-01-15T00:00:00Z",
    "sections": [
      {
        "name": "Quantitative Aptitude",
        "weightage": 25,
        "topics": [
          {"name": "Number System", "weightage": 15, "questions": 3},
          {"name": "Percentage", "weightage": 10, "questions": 2},
          {"name": "Ratio & Proportion", "weightage": 12, "questions": 2}
        ],
        "recommendedBooks": ["Quantitative Aptitude by RS Aggarwal"],
        "studyHours": 40
      }
    ],
    "examPattern": {
      "tiers": 2,
      "totalMarks": 800,
      "negativeMarking": 0.25,
      "duration": "120 minutes per tier"
    }
  }
}
8. ADMIN API
8.1 Create Job (Admin Only)
http
POST /admin/jobs
Headers:
http
Authorization: Bearer {admin_api_key}
X-Admin-User-Id: admin_123
Request Body:
json
{
  "postName": "New Engineering Job",
  "recruitmentBoard": "TSGENCO",
  "totalVacancies": 50,
  "lastDate": "2026-01-31T23:59:59Z",
  "state": "TS",
  "education": ["engineering"],
  "category": ["engineering"],
  "applyLink": "https://tsgenco.gov.in/apply",
  "eligibilityDetails": "Full eligibility details...",
  "officialNotification": "https://tsgenco.gov.in/notification.pdf",
  "options": {
    "generateSummary": true,
    "publishNow": false,
    "sendNotifications": true
  }
}
Response:
json
{
  "success": true,
  "data": {
    "id": "job_new_123",
    "aiSummary": "Auto-generated summary...",
    "processingStatus": "completed",
    "published": false,
    "estimatedMatches": 1250
  }
}
8.2 Bulk Job Upload
http
POST /admin/jobs/bulk
Content-Type: multipart/form-data
Form Data:
text
file: (CSV file)
options: {"validate": true, "generateSummaries": true}
CSV Format:
csv
postName,recruitmentBoard,totalVacancies,lastDate,state,education,applyLink
"Bank PO","SBI",1000,2026-01-31,All India,graduate,https://sbi.co.in/apply
"Junior Engineer","TSGENCO",50,2026-02-15,TS,engineering,https://tsgenco.gov.in/apply
8.3 Get System Analytics
http
GET /admin/analytics
Query Parameters:
Parameter	Type	Required	Description
period	string	No	day, week, month, year (default: week)
metric	string	No	users, jobs, revenue, engagement
Response:
json
{
  "success": true,
  "data": {
    "period": "2025-12-14 to 2025-12-21",
    "metrics": {
      "users": {
        "total": 12450,
        "new": 345,
        "active": 2450,
        "growth": 12.5
      },
      "jobs": {
        "total": 1256,
        "new": 45,
        "applications": 12450,
        "avgApplications": 9.9
      },
      "revenue": {
        "total": 124500,
        "subscriptions": 115000,
        "ads": 9500,
        "growth": 8.2
      },
      "performance": {
        "apiResponseTime": 145,
        "errorRate": 0.12,
        "uptime": 99.95
      }
    },
    "charts": {
      "userGrowth": [...],
      "jobCategories": [...],
      "revenueTrend": [...]
    }
  }
}
8.4 Get User Management
http
GET /admin/users
Query Parameters:
Parameter	Type	Required	Description
role	string	No	Filter by role
status	string	No	active, inactive, suspended
search	string	No	Search by name/email
Response:
json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "candidate",
      "status": "active",
      "createdAt": "2025-11-15T10:30:00Z",
      "lastLogin": "2025-12-21T09:15:00Z",
      "stats": {
        "jobsApplied": 12,
        "profileComplete": 85,
        "subscription": "premium"
      }
    }
  ],
  "meta": {
    "total": 12450,
    "active": 11050,
    "premium": 1245
  }
}
9. WEBHOOKS
9.1 Available Webhooks
Event	Description	Payload
job.created	New job posted	Job object
job.updated	Job updated	Job object
user.registered	New user registered	User object
user.subscribed	User purchased subscription	Subscription object
application.submitted	User applied for job	Application object
notification.sent	Notification dispatched	Notification object
9.2 Configure Webhook
http
POST /webhooks
Request Body:
json
{
  "url": "https://your-server.com/webhooks",
  "events": ["job.created", "user.registered"],
  "secret": "your_webhook_secret",
  "enabled": true,
  "retryPolicy": {
    "maxAttempts": 3,
    "interval": 5000
  }
}
9.3 Webhook Payload Example
json
{
  "event": "job.created",
  "timestamp": "2025-12-21T10:30:00Z",
  "data": {
    "id": "job_abc123",
    "postName": "Bank of India Credit Officer",
    "recruitmentBoard": "Bank of India",
    "totalVacancies": 514
  },
  "signature": "sha256=..."
}
9.4 Verify Webhook Signature
javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(payload).digest('hex')}`;
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
10. ERROR HANDLING
10.1 Error Response Format
json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "requestId": "req_123456789",
    "timestamp": "2025-12-21T10:30:00Z"
  }
}
10.2 Common Error Codes
Code	HTTP Status	Description
auth_required	401	Authentication required
invalid_token	401	Invalid or expired token
insufficient_permissions	403	Insufficient permissions
not_found	404	Resource not found
validation_error	422	Input validation failed
rate_limit_exceeded	429	Rate limit exceeded
internal_error	500	Internal server error
service_unavailable	503	Service temporarily unavailable
10.3 Retry Logic
javascript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
SDK LIBRARIES
JavaScript/Node.js SDK
bash
npm install @aijobalert/sdk
javascript
import { AIJobAlert } from '@aijobalert/sdk';

const client = new AIJobAlert({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Search jobs
const jobs = await client.jobs.search({
  state: 'TS',
  education: ['graduate']
});

// Check eligibility
const eligibility = await client.eligibility.check({
  userId: 'user_123',
  jobId: 'job_456'
});
Python SDK
bash
pip install aijobalert-sdk
python
from aijobalert import Client

client = Client(api_key="your_api_key")

# Get job recommendations
recommendations = client.jobs.recommend(
    user_id="user_123",
    limit=10
)
Postman Collection
Download collection: https://api.aijobalert.com/postman-collection.json

SUPPORT & CONTACT
Technical Support:
Email: api-support@aijobalert.com

Slack: aijobalert.slack.com

Documentation: https://docs.aijobalert.com

Status Page:
https://status.aijobalert.com

Emergency Contact:
For critical issues affecting production:

Phone: +91-XXXXXXXXXX

24/7 Support: Available for Enterprise customers

CHANGELOG
v1.0.0 (2025-12-21)
Initial API release

Basic CRUD operations for jobs and users

Eligibility checking system

Notification management

Upcoming v1.1.0 (Planned)
Advanced search with AI

Resume parsing endpoints

Batch operations

Webhook improvements

Document Control:

Version: 1.0

Last Updated: [Current Date]

Next Review: [Date + 30 days]

Owner: API Team Lead

Stakeholders: CTO, Product Manager, Development Team

This document is the authoritative source for all API interactions. Always refer to the latest version for up-to-date information.

