import datetime

from flask import url_for

from server import db


# Timezone adjustments
def now():
    return datetime.datetime.utcnow().replace(tzinfo=datetime.timezone.utc)

def astimezone(d, offset):
    return d.astimezone(datetime.timezone(datetime.timedelta(hours=offset)))

def PDTNow():
    return str(astimezone(now(), -7))

def PSTNow():
    return str(astimezone(now(), -8))


class Note(db.Model):
    __tablename__ = 'notes'

    id = db.Column(db.Integer(), primary_key=True)
    body = db.Column(db.Text(), index=True, nullable=False)
    timestamp = db.Column(db.Text(), nullable=False, default=PSTNow)


    def __init__(self, body):
        self.body = body


    def to_json(self):
        json_post = {
            "id": self.id,
            "body": self.body,
            "timestamp": self.timestamp,
            # "url": url_for('main.get_post', post_id=self.id)
        }
        return json_post


    @staticmethod
    def from_json(json_post):
        body = json_post.get('body')
        if body is None or body == '':
            raise ValidationError('post does not have any body')
        return Post(body=body)
