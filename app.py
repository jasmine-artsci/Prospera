from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev'  # Replace in production
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'network.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ---- Models ----
class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    headline = db.Column(db.String(200))
    bio = db.Column(db.Text)

class Connection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('profile.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('profile.id'))

    requester = db.relationship('Profile', foreign_keys=[requester_id])
    receiver = db.relationship('Profile', foreign_keys=[receiver_id])

# ---- Routes ----
def create_tables():
    with app.app_context():
        db.create_all()

@app.route('/')
def index():
    profiles = Profile.query.all()
    return render_template('index.html', profiles=profiles)

@app.route('/profile/<int:profile_id>')
def view_profile(profile_id):
    profile = Profile.query.get_or_404(profile_id)
    # Fetch connections involving this profile
    connections = Connection.query.filter(
        (Connection.requester_id == profile_id) | (Connection.receiver_id == profile_id)
    ).all()
    # Provide list of all profiles for connect dropdown as JSON
    profiles = Profile.query.all()
    profiles_json = [{"id": p.id, "name": p.name} for p in profiles]
    return render_template('profile.html', profile=profile, connections=connections, profiles_json=profiles_json)

@app.route('/new', methods=['GET', 'POST'])
def new_profile():
    if request.method == 'POST':
        name = request.form['name']
        headline = request.form['headline']
        bio = request.form['bio']
        if not name:
            flash('Name is required!', 'danger')
            return redirect(url_for('new_profile'))
        profile = Profile(name=name, headline=headline, bio=bio)
        db.session.add(profile)
        db.session.commit()
        flash('Profile created!', 'success')
        return redirect(url_for('index'))
    return render_template('new_profile.html')

@app.route('/connect', methods=['POST'])
def connect():
    requester_id = int(request.form['requester'])
    receiver_id = int(request.form['receiver'])
    # Prevent duplicate connections
    exists = Connection.query.filter_by(requester_id=requester_id, receiver_id=receiver_id).first() or \
             Connection.query.filter_by(requester_id=receiver_id, receiver_id=requester_id).first()
    if exists:
        flash('Connection already exists.', 'warning')
    elif requester_id == receiver_id:
        flash('Cannot connect to yourself.', 'danger')
    else:
        conn = Connection(requester_id=requester_id, receiver_id=receiver_id)
        db.session.add(conn)
        db.session.commit()
        flash('Connected successfully!', 'success')
    return redirect(url_for('view_profile', profile_id=receiver_id))


if __name__ == '__main__':
    create_tables()
    app.run(debug=True)
