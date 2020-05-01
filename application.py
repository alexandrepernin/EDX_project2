import os
import datetime
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import logging
import json

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []
all_messages = {}
MAX_NB_MESSAGES=100

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/channel", methods=["GET", "POST"])
def channel():
    return render_template('channel.html')

@app.route("/chat", methods=["GET","POST"])
def chat():
    return render_template('chat.html')

@socketio.on("Send message")
def send(data):
    global all_messages
    message = data["message"]
    sender = data["sender"]
    channel = data["channel"]
    timestamp = datetime.datetime.now().strftime("(%d-%b-%Y) %H:%M")
    all_messages[channel].append({'message':message, 'timestamp':timestamp, 'sender':sender})
    if len(all_messages[channel])>MAX_NB_MESSAGES:
        all_messages[channel]=all_messages[channel][1:]
    emit("deliver message", {"message": message, "sender":sender, "time": timestamp, "channel":channel}, broadcast=True)

@app.route("/create-channel", methods=["POST"])
def create_channel():
    global channels
    global all_messages
    channel = request.form.get("channel_name")
    if channel is None:
        return jsonify({"success": False})
    else:
        channels.append(channel)
        all_messages[channel] = []
        channels = list(dict.fromkeys(channels))
        return jsonify({"success": True})

@app.route("/get-channels", methods=["GET"])
def get_channel():
    return jsonify(channels)

@app.route("/get-messages", methods=["POST"])
def get_messages():
    channel = request.form.get("channel_name")
    if channel:
        app.logger.info('Channel pour lequel on demande les messages: {}'.format(channel))
        app.logger.info(print(json.dumps(all_messages[channel])))
        if len(all_messages[channel])>0:
            return jsonify(all_messages[channel])
        else:
            return jsonify({"Previous Messages": False})
    else:
        return jsonify({"success": False})

@app.route("/del-message", methods=["POST"])
def del_message():
    global all_messages
    timestamp = request.form.get("timestamp")
    sender = request.form.get("sender")
    message = request.form.get("message")
    dict = {'message':message, 'timestamp':timestamp, 'sender':sender}
    channel = request.form.get("channel")
    if message:
        for i,elem in enumerate(all_messages[channel]):
            if elem==dict:
                all_messages[channel].pop(i)
            else: continue
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})

if __name__ == '__main__':
    socketio.run(app)
