const mockTechnicalResults = [
  // Software Engineer Intern candidates
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a072" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f81" },
    "jobId": { "$oid": "Software Engineer Intern" },
    "userId": { "$oid": "675932b49c1a60d97c147419" }, // Top performer
    "scores": [
      { "score": 95, "maxScore": 100 },
      { "score": 48, "maxScore": 50 },
      { "score": 98, "maxScore": 100 }
    ],
    "totalScore": 241,
    "sttresslevel": "normal",
    "maxPossibleScore": 250,
    "createdAt": { "$date": "2025-05-27T08:53:34.179Z" },
    "updatedAt": { "$date": "2025-05-27T08:53:34.179Z" }
  },
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a073" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f82" },
    "jobId": { "$oid": "Software Engineer Intern" },
    "userId": { "$oid": "675932b49c1a60d97c147420" }, // Average performer
    "scores": [
      { "score": 80, "maxScore": 100 },
      { "score": 42, "maxScore": 50 },
      { "score": 85, "maxScore": 100 }
    ],
    "totalScore": 207,
    "sttresslevel": "high",
    "maxPossibleScore": 250,
    "createdAt": { "$date": "2025-05-28T09:15:22.179Z" },
    "updatedAt": { "$date": "2025-05-28T09:15:22.179Z" }
  },
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a074" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f83" },
    "jobId": { "$oid": "Software Engineer Intern" },
    "userId": { "$oid": "675932b49c1a60d97c147421" }, // Low performer
    "scores": [
      { "score": 65, "maxScore": 100 },
      { "score": 35, "maxScore": 50 },
      { "score": 70, "maxScore": 100 }
    ],
    "totalScore": 170,
    "sttresslevel": "low",
    "maxPossibleScore": 250,
    "createdAt": { "$date": "2025-05-29T10:20:15.179Z" },
    "updatedAt": { "$date": "2025-05-29T10:20:15.179Z" }
  },

  // Frontend Developer candidates
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a075" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f84" },
    "jobId": { "$oid": "Frontend Developer" },
    "userId": { "$oid": "675932b49c1a60d97c147422" }, // Excellent
    "scores": [
      { "score": 98, "maxScore": 100 },
      { "score": 50, "maxScore": 50 },
      { "score": 97, "maxScore": 100 }
    ],
    "totalScore": 245,
    "sttresslevel": "normal",
    "maxPossibleScore": 250,
    "createdAt": { "$date": "2025-05-27T11:30:45.179Z" },
    "updatedAt": { "$date": "2025-05-27T11:30:45.179Z" }
  },
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a076" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f85" },
    "jobId": { "$oid": "Frontend Developer" },
    "userId": { "$oid": "675932b49c1a60d97c147423" }, // Needs improvement
    "scores": [
      { "score": 70, "maxScore": 100 },
      { "score": 38, "maxScore": 50 },
      { "score": 72, "maxScore": 100 }
    ],
    "totalScore": 180,
    "sttresslevel": "high",
    "maxPossibleScore": 250,
    "createdAt": { "$date": "2025-05-28T14:45:33.179Z" },
    "updatedAt": { "$date": "2025-05-28T14:45:33.179Z" }
  },

  // Data Science Intern candidates
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a077" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f86" },
    "jobId": { "$oid": "Data Science Intern" },
    "userId": { "$oid": "675932b49c1a60d97c147424" }, // Strong candidate
    "scores": [
      { "score": 92, "maxScore": 100 },
      { "score": 47, "maxScore": 50 }
    ],
    "totalScore": 139,
    "sttresslevel": "normal",
    "maxPossibleScore": 150,
    "createdAt": { "$date": "2025-05-29T16:20:18.179Z" },
    "updatedAt": { "$date": "2025-05-29T16:20:18.179Z" }
  },
  {
    "_id": { "$oid": "68357d8e2818f98bcf55a078" },
    "interviewScheduleId": { "$oid": "68357ce32818f98bcf559f87" },
    "jobId": { "$oid": "Data Science Intern" },
    "userId": { "$oid": "675932b49c1a60d97c147425" }, // Average
    "scores": [
      { "score": 78, "maxScore": 100 },
      { "score": 42, "maxScore": 50 }
    ],
    "totalScore": 120,
    "sttresslevel": "normal",
    "maxPossibleScore": 150,
    "createdAt": { "$date": "2025-05-30T10:15:42.179Z" },
    "updatedAt": { "$date": "2025-05-30T10:15:42.179Z" }
  }
];

export default mockTechnicalResults;