"""Telegramga mehribon xabar yuboradi (GitHub Actions har soatda ishga tushiradi)."""
import json, os, random, sys, urllib.request
from datetime import datetime, timedelta, timezone

TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
CHAT_ID = os.environ["TELEGRAM_CHAT_ID"]
TZ = timezone(timedelta(hours=5))  # Toshkent vaqti

MORNING = ("Xayrli tong, yaxshimisiz? Yaxshi uxlab turdingizmi? "
           "Bugun kuningiz yaxshi o‘tsin. O‘zingizni ehtiyot qiling, xo‘pmi?")

DAY = [
    "Qalaysiz? Ishlaringiz yaxshi ketyaptimi? 😊",
    "Suv ichishni unutmang, xo‘pmi? 💧",
    "Ovqatlandingizmi? Vaqtida ovqatlaning, iltimos.",
    "Biroz dam oling, charchab qolmang. 🌿",
    "Sizni o‘ylab turibman. Kayfiyatingiz yaxshimi?",
    "Bugun ham zo‘rsiz! Davom eting 💪",
    "Bir daqiqa to‘xtab, chuqur nafas oling. Hammasi yaxshi bo‘ladi.",
    "O‘zingizni ehtiyot qiling, xo‘pmi? ❤️",
    "Kuningiz qanday o‘tyapti? Hammasi joyidami?",
    "Ko‘zingizni ekrandan biroz dam oldiring 🙂",
]

NIGHT = "Xayrli tun! Yaxshi dam oling, ertaga yana gaplashamiz 🌙"

DAY_HOURS = range(11, 22)  # 11:00 dan 21:00 gacha har soatda
NIGHT_HOUR = 22


def pick(hour):
    if hour == 8:
        return MORNING
    if hour in DAY_HOURS:
        return random.choice(DAY)
    if hour == NIGHT_HOUR:
        return NIGHT
    return None


def main():
    hour = datetime.now(TZ).hour
    if len(sys.argv) > 1:          # qo'lda sinash: python send.py 8
        hour = int(sys.argv[1])
    text = pick(hour)
    if not text:
        print(f"Soat {hour}:00 — xabar yo'q")
        return
    data = json.dumps({"chat_id": CHAT_ID, "text": text}).encode()
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{TOKEN}/sendMessage",
        data=data, headers={"Content-Type": "application/json"})
    print(urllib.request.urlopen(req, timeout=30).read().decode())


if __name__ == "__main__":
    main()
