import { Injectable } from '@angular/core';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ConnectionclientService {

  private client: any;

  constructor() {
    const socket = io("http://localhost:3030", {
      transports: ['websocket'],
    });

    socket.on("connect", () => {
      console.log("Socket connected ");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected ");
    });

    this.client = feathers();
    this.client.configure(socketio(socket));
    this.client.configure(authentication());
  }

  getStudentClient() {
    console.log("sockeeee")
    return this.client.service('students');
  }
  getProductClient() {
    return this.client.service('products');
  }

  async authenticate() {
    const token = localStorage.getItem('token');
    console.log("TOKENNNN", token)

    if (token) {
      try {
        await this.client.authenticate({
          strategy: "jwt",
          accessToken: token
        });
        console.log("Socket Authenticated ");
      } catch (err) {
        console.error("Auth failed ", err);
      }
    } else {
      console.error("No token found ");
    }
  }
}