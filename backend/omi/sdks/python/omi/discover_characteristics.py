import asyncio
from bleak import BleakClient

OMI_MAC = "D4:5E:89:C0:DD:A8"  # Replace with your actual MAC

async def main():
    async with BleakClient(OMI_MAC) as client:
        services = client.services
        print("Listing all services and characteristics...\n")

        for service in services:
            print(f"[Service] {service.uuid} - {service.description}")
            for char in service.characteristics:
                print(f"  [Characteristic] {char.uuid} - {char.description}")
                print(f"    Properties: {char.properties}")
                if "notify" in char.properties:
                    print("    ✅ Notifiable (can stream data)")

asyncio.run(main())
