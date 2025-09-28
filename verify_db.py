"""
Database verification script
"""
import sqlite3

conn = sqlite3.connect('automation_platform.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("📊 Database Verification Report")
print("=" * 40)
print("Tables created:")
for table in tables:
    print(f"✅ {table[0]}")

# Check sample data
cursor.execute("SELECT COUNT(*) FROM users")
user_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM workflows") 
workflow_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM email_campaigns")
campaign_count = cursor.fetchone()[0]

print(f"\nSample data:")
print(f"✅ Users: {user_count}")
print(f"✅ Workflows: {workflow_count}")
print(f"✅ Email Campaigns: {campaign_count}")

# Check user details
cursor.execute("SELECT email, username, role FROM users")
users = cursor.fetchall()
print(f"\nUser accounts:")
for user in users:
    print(f"✅ {user[1]} ({user[0]}) - Role: {user[2]}")

conn.close()
print("\n🎉 Database verification completed successfully!")