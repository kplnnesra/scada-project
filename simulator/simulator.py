import requests
import random
import time
import json

BASE_URL = "http://localhost:5000/api"

def login():
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@scada.com",
        "password": "admin123"
    })
    return res.json()["token"]

def create_meters(token):
    headers = {"Authorization": f"Bearer {token}"}
    meters = [
        {"name": "Elektrik Sayacı 1", "type": "electricity", "location": "Bina A - Kat 1"},
        {"name": "Elektrik Sayacı 2", "type": "electricity", "location": "Bina A - Kat 2"},
        {"name": "Su Sayacı 1", "type": "water", "location": "Bina B - Bodrum"},
        {"name": "Doğalgaz Sayacı 1", "type": "gas", "location": "Bina C - Giriş"},
    ]
    meter_ids = []
    for m in meters:
        res = requests.post(f"{BASE_URL}/meters", json=m, headers=headers)
        if res.status_code == 200:
            meter_ids.append(res.json()["id"])
            print(f"Sayaç oluşturuldu: {m['name']}")
    return meter_ids

def send_readings(token, meter_ids):
    headers = {"Authorization": f"Bearer {token}"}
    units = {0: "kWh", 1: "kWh", 2: "m3", 3: "m3"}
    base_values = {0: 1000, 1: 800, 2: 200, 3: 150}
    
    print("\nSimülatör başladı, her 5 saniyede okuma gönderiliyor...")
    print("Durdurmak için Ctrl+C\n")
    
    while True:
        for i, meter_id in enumerate(meter_ids):
            value = base_values[i] + random.uniform(-10, 15)
            base_values[i] = value
            
            res = requests.post(
                f"{BASE_URL}/meters/{meter_id}/readings",
                json={"value": round(value, 2), "unit": units[i]},
                headers=headers
            )
            
            if res.status_code == 200:
                print(f"Sayaç {meter_id}: {round(value, 2)} {units[i]}")
            
            # Yüksek tüketim alarmı
            if i in [0, 1] and value > 1050:
                requests.post(f"{BASE_URL}/alarms", json={
                    "meter_id": meter_id,
                    "message": f"Yüksek tüketim tespit edildi: {round(value, 2)} kWh",
                    "type": "high_consumption"
                }, headers=headers)
                print(f"⚠️  ALARM: Sayaç {meter_id} yüksek tüketim!")
        
        print("---")
        time.sleep(5)

def main():
    print("SCADA Simülatörü başlatılıyor...")
    token = login()
    print("Giriş başarılı!")
    
    meter_ids = create_meters(token)
    
    if not meter_ids:
        print("Sayaçlar zaten var, okuma gönderiliyor...")
        res = requests.get(f"{BASE_URL}/meters", headers={"Authorization": f"Bearer {token}"})
        meter_ids = [m["id"] for m in res.json()]
    
    send_readings(token, meter_ids)

if __name__ == "__main__":
    main()