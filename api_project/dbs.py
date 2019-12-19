from server import db
from models import Note

try:
    db.drop_all()
except Exception:
    pass

db.create_all()

# n = Note("hello")

# db.session.add(n)
# db.session.commit()
