"""
NIDHIVIZH - Evidence-Driven Transaction Risk Investigation Assistant
Standalone Python FastAPI Backend for Hackathon Execution: python app.py -> http://localhost:8000
"""

import os
import math
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(
    title="NidhiVizh - Transaction Risk Investigation Assistant",
    description="Evidence-Driven Transaction Risk Investigation API (TRACK_ID=PS6 Banking)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo Customers
CUSTOMERS = {
    "CUS-10482": {
        "id": "CUS-10482",
        "name": "Arun Kumar",
        "accountNumber": "**** 4821",
        "accountType": "Savings",
        "customerSince": "2019-03-14",
        "branch": "T. Nagar Branch, Chennai",
        "scenarioType": "high_risk",
        "scenarioLabel": "High Risk: Rapid Outbound Burst to New Beneficiary",
        "baseline": {
            "meanAmount": 2450,
            "medianAmount": 1850,
            "stdDev": 920,
            "monthlyFrequency": 42,
            "activeHoursStart": 8,
            "activeHoursEnd": 22,
            "commonPayees": ["FreshMart Groceries", "Amazon India", "Swiggy Food Delivery", "TNEB Electricity Board"],
            "commonChannels": ["UPI", "Debit Card", "NEFT"],
            "typicalLocations": ["Chennai, TN"],
            "hasSufficientData": True
        }
    },
    "CUS-20831": {
        "id": "CUS-20831",
        "name": "Priya Sharma",
        "accountNumber": "**** 8319",
        "accountType": "Current",
        "customerSince": "2021-06-18",
        "branch": "Fort Commercial Branch, Mumbai",
        "scenarioType": "ambiguous",
        "scenarioLabel": "Ambiguous / Legitimate Recurring Large Vendor Context",
        "baseline": {
            "meanAmount": 8200,
            "medianAmount": 6500,
            "stdDev": 14200,
            "monthlyFrequency": 55,
            "activeHoursStart": 9,
            "activeHoursEnd": 20,
            "commonPayees": ["Gujarat Wholesale Weaving Co", "Sharma Textiles Raw Material"],
            "commonChannels": ["NEFT", "Net Banking"],
            "typicalLocations": ["Mumbai, MH"],
            "regularLargePaymentPattern": True,
            "hasSufficientData": True
        }
    },
    "CUS-30914": {
        "id": "CUS-30914",
        "name": "Vikram Rao",
        "accountNumber": "**** 9140",
        "accountType": "Salary",
        "customerSince": "2020-11-05",
        "branch": "Indiranagar Branch, Bengaluru",
        "scenarioType": "clean",
        "scenarioLabel": "Clean / Baseline Compliant: No Material Anomalies",
        "baseline": {
            "meanAmount": 1800,
            "medianAmount": 1450,
            "stdDev": 520,
            "monthlyFrequency": 38,
            "activeHoursStart": 8,
            "activeHoursEnd": 21,
            "commonPayees": ["Reliance Fresh", "Metro Rail Recharge", "Apollo Pharmacy"],
            "commonChannels": ["UPI", "Debit Card"],
            "typicalLocations": ["Bengaluru, KA"],
            "hasSufficientData": True
        }
    },
    "CUS-41920": {
        "id": "CUS-41920",
        "name": "Meera Patel",
        "accountNumber": "**** 9204",
        "accountType": "Savings",
        "customerSince": "2026-08-20",
        "branch": "Shivajinagar Branch, Pune",
        "scenarioType": "insufficient_data",
        "scenarioLabel": "Insufficient Evidence / New Account (Sparse Baseline)",
        "baseline": {
            "meanAmount": 4590,
            "medianAmount": 3499,
            "stdDev": 3900,
            "monthlyFrequency": 3,
            "activeHoursStart": 8,
            "activeHoursEnd": 22,
            "commonPayees": ["Self Account Transfer", "Coffee Day Cafe"],
            "commonChannels": ["NEFT", "Debit Card", "UPI"],
            "typicalLocations": ["Pune, MH"],
            "hasSufficientData": False
        }
    }
}

TRANSACTIONS = {
    "CUS-10482": [
        {"id": "TXN-10482-1842", "date": "2026-08-31", "time": "02:41", "payee": "XYZ Services Ltd", "amount": 40000, "channel": "UPI", "payeeStatus": "New"},
        {"id": "TXN-10482-1843", "date": "2026-08-31", "time": "02:48", "payee": "XYZ Services Ltd", "amount": 45000, "channel": "UPI", "payeeStatus": "New"},
        {"id": "TXN-10482-1845", "date": "2026-08-31", "time": "03:02", "payee": "XYZ Services Ltd", "amount": 25000, "channel": "UPI", "payeeStatus": "New"}
    ]
}

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "engine": "NidhiVizh Python Risk Engine",
        "port": 8000,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/dashboard")
def dashboard():
    return {
        "kpis": {
            "totalCustomersReviewed": 1248,
            "transactionsAnalysed": 48392,
            "attentionRequired": 37,
            "highPriority": 8
        },
        "riskDistribution": [
            {"name": "Normal", "count": 46250, "color": "#0072CE"},
            {"name": "Low Attention", "count": 1420, "color": "#00A3E0"},
            {"name": "Medium Attention", "count": 642, "color": "#FFC700"},
            {"name": "High Attention", "count": 80, "color": "#DC2626"}
        ]
    }

@app.get("/api/customers")
def get_customers():
    return list(CUSTOMERS.values())

@app.get("/api/customers/{customer_id}")
def get_customer(customer_id: str):
    if customer_id not in CUSTOMERS:
        raise HTTPException(status_code=404, detail="Customer not found")
    return CUSTOMERS[customer_id]

@app.get("/api/customers/{customer_id}/transactions")
def get_customer_transactions(customer_id: str):
    return TRANSACTIONS.get(customer_id, [])

@app.get("/api/rules")
def get_rules():
    return [
        {"id": "R01", "name": "Unusually Large Transfer", "severity": "HIGH", "weight": 30},
        {"id": "R02", "name": "Burst Payments to New Payee", "severity": "HIGH", "weight": 25},
        {"id": "R03", "name": "Odd-Hours Activity", "severity": "MEDIUM", "weight": 20},
        {"id": "R04", "name": "Deviation from Customer Normal Behaviour", "severity": "MEDIUM", "weight": 25}
    ]

if __name__ == "__main__":
    print("NidhiVizh Banking Risk Investigation Assistant starting on http://localhost:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
