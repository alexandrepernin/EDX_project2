import os

from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/channel", methods=["POST"])
def channel():
    name = request.form.get("name")
    if not any(c.isalpha() for c in name):
        return render_template('index.html')
    else:
        return render_template('channel.html', name=name, channels=channels)

@app.route("/chat", methods=["POST"])
def chat():
    channel = request.form.get("channel_name")
    if channel in channels:
        return render_template('channel.html', name=name, message='Channel already exists', channels=channels)
    else:
        channels.append(channel)
        return("New channel named {}".format(channel))
