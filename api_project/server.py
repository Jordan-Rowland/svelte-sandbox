import os

from flask import Flask, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = \
    f"sqlite:///{os.path.join(basedir, 'data.sqlite')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

from models import Note

####################################
@app.route("/")
def base():
    return send_from_directory('client/public', 'index.html')


@app.route("/<path:path>")
def home(path):
    return send_from_directory('client/public', path)
####################################

@app.route("/notes", methods=["POST"])
def add_note():
    note = Note.from_json(request.get_json())
    db.session.add(post)
    db.session.commit()
    return jsonify(note.to_json()), 201


@app.route("/notes")
def posts():
    notes = Note.query.all()
    return jsonify({
        "notes": [note.to_json() for note in notes]
    })


if __name__ == "__main__":
    app.run(debug=True)
