declare module 'hubot/user' {
	/**
	 * Represents a participating user in the chat.
	 */
	export default class User {
	    id: any;
	    /**
	     * The user's name
	     */
	    name: string;
	    /**
	     * Initializes a new instance of the <<User>> class.
	     * @param _id A unique ID for the user.
	     * @param options An optional hash of key, value pairs for this user.
	     */
	    constructor(id: any, options?: {
	        [k: string]: string;
	    });
	}

}
declare module 'hubot/message' {
	import User from 'hubot/user';
	/**
	 * Message envelope
	 */
	export interface Envelope {
	    message?: Message;
	    room?: string;
	    user?: User;
	}
	/**
	 * Represents an incoming message from the chat.
	 */
	export class Message {
        id: string;
	    user: User;
        done: boolean;
	    /**
	     * Room where message came from
	     */
	    room: string;
	    /**
	     * Initializes a new instance of the <<Message>> class.
	     * @param user A <<User>> instance that sent the message
	     * @param done Flag for whether this message is fully processed
	     */
	    constructor(user: User, done?: boolean);
	    /**
	     * Indicates that no other <<Listener>> should be called on this object.
	     */
	    finish(): void;
    }
	/**
	 * Represents an incoming message from the chat.
	 */
	export class TextMessage extends Message {
	    user: User;
	    text: string;
	    id: string;
	    /**
	     * Initializes a new instance of the <<TextMessage>> class.
	     * @param user A <<User>> instance that sent the message
	     * @param text A string message
	     * @param id A string of the message id
	     */
	    constructor(user: User, text: string, id: string);
	    /**
	     * Determines if the message matches the given regex.
	     * @param regex A regex to check
	     * @returns A match object or null
	     */
	    match(regex: string | RegExp): RegExpMatchArray;
	    /**
	     * String representation of a <<TextMessage>>
	     * @returns The message text
	     */
	    toString(): string;
    }
	/**
	 * Represents an incoming user entrance notification.
	 */
	export class EnterMessage extends Message {
	}
	/**
	 * Represents an incoming user exit notification.
	 */
	export class LeaveMessage extends Message {
	}
	/**
	 * Represents an incoming topic change notification
	 */
	export class TopicMessage extends TextMessage {
	}
	/**
	 * Represents a message that no matchers matched.
	 */
	export class CatchAllMessage extends Message {
	    message: Message;
	    /**
	     * Initializes a new instance of the <<CatchAllMessage>> class.
	     * @param message The original <<Message>>
	     */
	    constructor(message: Message);
	}

}
declare module 'hubot/brain' {
	/// <reference path="../typings/main.d.ts" />
	/// <reference types="node" />
	import { EventEmitter } from "events";
	import User from 'hubot/user';
	import Robot from 'hubot/robot';
	/**
	 * Represents somewhat persistent storage for the robot.
	 */
	export default class Brain extends EventEmitter {
	    /**
	     * The brain's data
	     */
	    private _data;
	    /**
	     * Autosave setting
	     */
	    private _autoSave;
	    /**
	     * Autosave interval handle
	     */
	    private _saveInterval;
	    /**
	     * Initializes a new instance of the <<Brain>> class.
	     * @param robot The <<Robot>> instance.
	     */
	    constructor(robot: Robot);
	    /**
	     * Store key-value pair under the private namespace and extend
	     * existing this._data before emitting the "loaded" event.
	     * @param key String key to store
	     * @param value Value to store
	     * @returns This instance for chaining
	     */
	    set(key: Object): this;
	    set(key: string, value: any): this;
	    /**
	     * Get value by key from the private namespace in this._data
	     * or return null if not found.
	     * @returns The value.
	     */
	    get(key: string): any;
	    /**
	     * Remove value by key from the private namespace in this._data
	     * if it exists
	     * @returns This instance for chaining.
	     */
	    remove(key: string): this;
	    /**
	     * Emits the "save" event so that "brain" scripts can handle
	     * persisting.
	     */
	    save(): void;
	    /**
	     * Emits the "close" event so that "brain" scripts can handle closing
	     */
	    close(): void;
	    /**
	     * Enable or disable the automatic saving
	     * @param enabled A boolean whether to autosave or not
	     */
	    setAutoSave(enabled: boolean): void;
	    /**
	     * Reset the interval between save function calls.
	     * @param seconds An integer of seconds between saves.
	     */
	    resetSaveInterval(seconds: number): void;
	    /**
	     * Merge keys loaded from a DB against the in memory representation.
	     * Caveats: Deeply nested structures don't merge well.
	     */
	    mergeData(data?: Object): void;
	    /**
	     * Get an array of <<User>> objects stored in the brain.
	     * @returns An array of <<User>> objects.
	     */
	    users(): {
	        [name: string]: User;
	    };
	    /**
	     * Get a <<User>> object given a unique identifier.
	     * @returns A <<User>> instance of the specified user.
	     */
	    userForId(id: string, options?: {
	        [k: string]: string;
	    }): User;
	    /**
	     * Get a <<User>> object given a name.
	     * @returns A <<User>> instance for the user with the specified name.
	     */
	    userForName(name: string): User;
	    /**
	     * Get all users whose names match fuzzyName. Currently, match
	     * means "startsWith"
	     * @returns An array of <<User>> instance matching the fuzzy name.
	     */
	    usersForRawFuzzyName(fuzzyName: string): User[];
	    /**
	     * If fuzzyName is an exact match for a user, returns an array with
	     * just that user. Otherwise, returns an array of all users for which
	     * fuzzyName is a raw fuzzy match (see usersForRawFuzzyName)
	     * @returns An array of <<User>> instances matching the fuzzy name.
	     */
	    usersForFuzzyName(fuzzyName: string): User[];
	}

}
declare module 'hubot/response' {
	import * as scoped from "scoped-http-client";
	import Robot from 'hubot/robot';
	import { Context } from 'hubot/middleware';
	import { Envelope, Message } from 'hubot/message';
	export interface ResponseContext extends Context {
	    strings: string[];
	    method: string;
	    plaintext: boolean;
	}
	/**
	 * Responses are sent to matching listeners. Message know about the
	 * content and user that made the original message, and how to reply
	 * back to them.
	 */
	export default class Response {
	    message: Message;
	    match: RegExpMatchArray;
	    /**
	     * Message envelope
	     */
	    envelope: Envelope;
	    /**
	     * Initializes a new instance of the <<Response>> class.
	     * @param _robot A <<Robot>> instance.
	     * @param _message A <<Message>> instance.
	     * @param match A match object from the successful regex match.
	     */
	    constructor(_robot: Robot, message: Message, match?: RegExpMatchArray);
	    /**
	     * Posts a message back to the chat source
	     * @param strings One or more strings to be posted. The order of these strings
	     *  should be kept intact.
	     */
		send(...strings: string[]): Promise<void>;
		/**
	     * Posts an emote back to the chat source
	     * @param strings One or more strings to be posted. The order of these strings
	     *  should be kept intact.
	     */
  		emote(...strings: string[]): Promise<void>;
	    /**
	     * Posts a message mentioning the current user.
	     * @param strings One or more strings to be posted. The order of these strings
	     *  should be kept intact.
	     */
	    reply(...strings: string[]): Promise<void>;
	    /**
	     * Posts a topic changing message.
	     * @param strings One or more strings to set as the topic of the
	     *  room the bot is in.
	     */
	    topic(...strings: string[]): Promise<void>;
	    /**
	     * Posts a sound in the chat source.
	     * @param strings One or more strings to be posted as sounds to play. The
	     *  order of these strings should be kept intact.
	     */
	    play(...strings: string[]): Promise<void>;
	    /**
	     * Posts a message in an unlogged room.
	     * @param strings One or more strings to be posted. The order of these strings
	     *  should be kept intact.
	     */
	    locked(...strings: string[]): Promise<void>;
	    /**
	     * Picks a random item from the given items.
	     * @param items An array of items.
	     * @returns a random item.
	     */
	    random<T>(items: T[]): T;
	    /**
	     * Tell the message to stop dispatching to listeners
	     */
	    finish(): void;
	    /**
	     * Creates a scoped http client with chainable methods for
	     * modifying the request. This doesn't actually make a request
	     * though. Once your request is assembled, you can call `get()`/`post()`
	     * etc to send the request.
	     * @param url String URL to access
	     * @param options Optional options to pass on to the client
	     * @returns a <<ScopedClient>> instance.
	     */
	    http(url: string, options?: scoped.Options): scoped.ScopedClient;
	    /**
	     * Call with a method for the given strings using response
	     * middleware.
	     */
	    public runWithMiddleware(methodName: string, opts: any, ...strings: string[]): void;
	}

}
declare module 'hubot/listener' {
	import { Message } from 'hubot/message';
	import Middleware, { Context } from 'hubot/middleware';
	import Robot from 'hubot/robot';
	import Response from 'hubot/response';
	export type Matcher = (message: Message) => any;
	export type ListenerCallback = (response: Response) => void;
	export interface ListenerContext extends Context {
	    listener: Listener;
	}
	/**
	 * Listeners receive every message from the chat source and decide
	 * if they want to act on it.
	 */
	export class Listener {
	    private _robot;
	    private _matcher;
	    private _options;
	    private _callback;
	    /**
	     * Regex used, if one was used
	     */
	    regex: RegExp;
	    /**
	     * Initializes a new instance of the <<Listener>> class.
	     * An identifier should be provided in the options paramter to uniquely
	     * identify the listener (options.id).
	     * @param robot A robot instance
	     * @param matcher A function that determines if this listener should trigger the
	     *  callback
	     * @param options An object of additional parameters keyed on extension name (optional).
	     * @param callback A function that is triggered if the incoming message matches.
	     */
	    constructor(_robot: Robot, _matcher: Matcher, _callback: ListenerCallback);
	    constructor(_robot: Robot, _matcher: Matcher, _options: any, _callback: ListenerCallback);
	    /**
	     * Determines if the listener likes the content of the message. If
	     * so, a <<Response>> built from the given <<Message>> is passed through
	     * all registered middleware and potentially the <<Listener>> callback. Note
	     * that middleware can intercept the message and prevent the callback from ever
	     * being executed.
	     * @param message A <<Message>> instance
	     * @param middleware Optional <<Middleware>> object to execute before the <<Listener>> callback
	     */
	    call(message: Message, middleware?: Middleware<ListenerContext>): Promise<boolean>;
	}
	/**
	 * TextListeners receive every message from the chat source and decided if they
	 * want to act on it.
	 */
	export class TextListener extends Listener {
	    /**
	     * Initializes a new instance of the <<TextListener>> class.
	     * @param robot A robot instance
	     * @param matcher A function that determines if this listener should trigger the
	     *  callback
	     * @param options An object of additional parameters keyed on extension name (optional).
	     * @param callback A function that is triggered if the incoming message matches.
	     */
	    constructor(robot: Robot, regex: RegExp, options: any, callback?: ListenerCallback);
	}

}
declare module 'hubot/middleware' {
	import Robot from 'hubot/robot';
	import Response from 'hubot/response';
	export type MiddlewareFunc<T extends Context> = (context: T, next: (done: Function) => void, done: Function) => void;
	export interface Context {
	    response: Response;
	}
	/**
	 * Middleware handler
	 */
	export default class Middleware<T extends Context> {
	    private _robot;
	    /**
	     * Middleware stack
	     */
	    private _stack;
	    /**
	     * Initializes a new instance of the <<Middleware>> class.
	     * @params _robot A <<robot>> instance.
	     */
	    constructor(_robot: Robot);
	    /**
	     * Execute all middleware in order and call "next" with the latest
	     * "done" callback if last middleware calls through. If all middleware is
	     * compliant, "done" should be called with no arguments when the entire
	     * round trip is complete.
	     *
	     * @param context context object that is passed through the middleware stack.
	     *  When handling errors, this is assumed to have a "response" property.
	     */
	    execute(context: T): Promise<T>;
	    /**
	     * Registers a new middleware
	     * @param middleware A generic pipeline component function that can either
	     *  continue the pipeline or interrupt it. The function is called with
	     *  (context, next, done), the middleware should call the "next" function
	     *  with "done" as an optional argument. If not, the middleware should call
	     *  the "done" function with no arguments. Middleware may wrap the "done" function
	     *  in order to execute logic after the final callback has been executed.
	     */
	    register(middleware: MiddlewareFunc<T>): void;
	    /**
	     * Turn a middleware function into a promise.
	     */
	    private _middlewareExecAsync(middleware, context, done);
	}

}
declare module 'hubot/robot' {
	/// <reference path="../typings/main.d.ts" />
	/// <reference types="node" />
	import * as express from "express";
	import * as scoped from "scoped-http-client";
    import { EventEmitter } from "events";
    import { Logger } from "loglevel";
	import { Adapter } from 'hubot/adapter';
	import Brain from 'hubot/brain';
	import Middleware, { Context, MiddlewareFunc } from 'hubot/middleware';
	import Response, { ResponseContext } from 'hubot/response';
	import { Matcher, ListenerCallback, ListenerContext } from 'hubot/listener';
	import { Envelope, Message } from 'hubot/message';
	export interface RobotMiddleware {
	    listener: Middleware<ListenerContext>;
	    response: Middleware<ResponseContext>;
	    receive: Middleware<Context>;
	}
	/**
	 * Robots receive message from a chat source and dispatch them to
	 * matching listeners
	 */
	export default class Robot extends EventEmitter {
		Response: typeof Response;
	    adapterName: string;
	    name: string;
	    alias: string;
	    /**
	     * Robot brain instance
	     */
	    brain: Brain;
	    /**
	     * Adapter instance
	     */
	    adapter: Adapter;
	    /**
	     * Robot middlewares
	     */
	    middleware: RobotMiddleware;
	    /**
	     * Logger instance
	     */
	    logger: Logger;
	    /**
	     * HTTP Router
	     */
	    router: express.Express;
	    /**
	     * Global scoped http client options
	     */
        globalHttpOptions: scoped.Options;

		auth?: any;

	    /**
	     * Initializes a new instance of the <<Robot>> class.
	     * @param _adapterPath  Path to the adapter script
	     * @param adapterName   Name of the adapter to use
	     * @param httpd         Flag for enabling the HTTP server
	     * @param name          Name of this robot instance
	     * @param alias         Alias for this robot instance
	     */
	    constructor(_adapterPath: string, adapterName: string, httpd: boolean, name?: string, alias?: string);
	    /**
	     * Adds a custom listener with the provided matcher, options and callback
	     * @param matcher A function that determines whether to call the callback.
	     *  Expected to return a truthy value if the callback should be executed.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a <<Response>> object if the
	     *  matcher function returns true.
	     */
	    listen(matcher: Matcher, callback: ListenerCallback): void;
	    listen(matcher: Matcher, options: any, callback: ListenerCallback): void;
	    /**
	     * Adds a <<Listener>> that attempts to match incoming messages based on a
	     * Regex.
	     * @param matcher A function that determines whether to call the callback.
	     *  Expected to return a truthy value if the callback should be executed.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a <<Response>> object if the
	     *  matcher function returns true.
	     */
	    hear(regex: RegExp, callback: ListenerCallback): void;
	    hear(regex: RegExp, options: any, callback: ListenerCallback): void;
	    /**
	     * Adds a <<Listener>> that attempts to match incoming messages directed
	     * at the robot based on a Regex. All regexes treat patterns like they begin
	     * with a '^'.
	     * @param matcher A function that determines whether to call the callback.
	     *  Expected to return a truthy value if the callback should be executed.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a <<Response>> object if the
	     *  matcher function returns true.
	     */
	    respond(regex: RegExp, callback: ListenerCallback): void;
        respond(regex: RegExp, options: any, callback: ListenerCallback): void;
	    /**
	     * Adds a <<Listener>> that triggers when anyone enters the room.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a Response object.
	     */
	    enter(callback: ListenerCallback): void;
	    enter(options: any, callback: ListenerCallback): void;
	    /**
	     * Adds a <<Listener>> that triggers when anyone leaves the room.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a Response object.
	     */
	    leave(callback: ListenerCallback): void;
	    leave(options: any, callback: ListenerCallback): void;
	    /**
	     * Adds a <<Listener>> that triggers when anyone changes the topic.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a Response object.
	     */
	    topic(callback: ListenerCallback): void;
	    topic(options: any, callback: ListenerCallback): void;
	    /**
	     * Adds a <<Listener>> that triggers when no other text matchers match.
	     * @param options An object of additional parameters keyed on extension name
	     *  (optional)
	     * @param callback A function that is called with a Response object.
	     */
	    catchAll(callback: ListenerCallback): void;
	    catchAll(options: any, callback: ListenerCallback): void;
	    /**
	     * Adds an error handler when an uncaught exception or user emitted
	     * error event occurs.
	     * @params callback A function that is called with the error object.
	     */
	    error(callback: Function): void;
	    /**
	     * Registers new middleware for execution after matching but before
	     * Listener callbacks
	     * @param middleware A generic pipeline component function that can either
	     *  continue the pipeline or interrupt it. The function is called with
	     *  (context, next, done), the middleware should call the "next" function
	     *  with "done" as an optional argument. If not, the middleware should call
	     *  the "done" function with no arguments. Middleware may wrap the "done" function
	     *  in order to execute logic after the final callback has been executed.
	     */
	    listenerMiddleware(middleware: MiddlewareFunc<ListenerContext>): void;
	    /**
	     * Registers new middleware for execution as a response to any message is being
	     * sent.
	     * @param middleware A generic pipeline component function that can either
	     *  continue the pipeline or interrupt it. The function is called with
	     *  (context, next, done), the middleware should call the "next" function
	     *  with "done" as an optional argument. If not, the middleware should call
	     *  the "done" function with no arguments. Middleware may wrap the "done" function
	     *  in order to execute logic after the final callback has been executed.
	     */
	    responseMiddleware(middleware: MiddlewareFunc<ResponseContext>): void;
	    /**
	     * Registers new middleware for execution before matching
	     * @param middleware A generic pipeline component function that can either
	     *  continue the pipeline or interrupt it. The function is called with
	     *  (context, next, done), the middleware should call the "next" function
	     *  with "done" as an optional argument. If not, the middleware should call
	     *  the "done" function with no arguments. Middleware may wrap the "done" function
	     *  in order to execute logic after the final callback has been executed.
	     */
	    receiveMiddleware(middleware: MiddlewareFunc<Context>): void;
	    /**
	     * Passes the given message to any interested Listeners after running
	     * receive middleware
	     * @param message A message instance. Listeners can flag this message as "done"
	     *  to prevent further execution
	     * @returns Promise which resolves when processing is complete.
	     */
	    receive(message: Message): Promise<void>;
	    /**
	     * Loads a file in path.
	     * @param filePath A string path on the filesystem.
	     * @param fileName A string filename in path on the filesystem.
	     */
	    loadFile(filePath: string, fileName: string): Promise<void>;
	    /**
	     * Loads every script in the given path.
	     * @param filePath A string path on the filesystem.
	     */
	    load(filePath: string): Promise<void>;
	    /**
	     * Load script specified in the `hubot-scripts.json` file.
	     * @param filePath A string path to the hubot-scripts files.
	     * @param scripts An array of scripts to load.
	     */
	    loadHubotScripts(filePath: string, scripts: string[]): Promise<void>;
	    /**
	     * Load scripts from packages specified in the `external-scripts.json` file.
	     * @param packages An array of packages containing hubot scripts to load.
	     */
	    loadExternalScripts(packages: string[] | Object): Promise<void>;
	    /**
	     * A helper send function which delegates to the adapter's send
	     * function.
	     * @param envelope A object with message, room, and user details
	     * @param strings One or more strings for each message to send.
	     */
	    send(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * A helper reply function which delegates to the adapter's reply
	     * function.
	     * @param envelope A object with message, room, and user details
	     * @param strings One or more strings for each message to send.
	     */
	    reply(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * A helper send function to message a room that the robot is in.
	     * function.
	     * @param room String designating the room to message.
	     * @param strings One or more strings for each message to send.
	     */
	    messageRoom(room: string, ...strings: string[]): void;
	    /**
	     * Kick off the event loop for the adapter.
	     */
	    run(): void;
	    /**
	     * Gracefully shutdown the robot process.
	     */
	    shutdown(): void;
	    /**
	     * Help commands for running scripts.
	     * @returns An Array of help commands for running scripts.
	     */
	    helpCommands(): string[];
	    /**
	     * Creates a scoped http client with chainable methods for
	     * modifying the request. This doesn't actually make a request
	     * though. Once your request is assembled, you can call `get()`/`post()`
	     * etc to send the request.
	     * @param url String URL to access
	     * @param options Optional options to pass on to the client
	     * @returns a <<ScopedClient>> instance.
	     */
	    http(url: string, options?: scoped.Options): scoped.ScopedClient;
	}

}
declare module 'hubot/adapter' {
	/// <reference path="../typings/main.d.ts" />
	/// <reference types="node" />
	import { EventEmitter } from "events";
	import { Message, Envelope } from 'hubot/message';
	import Robot from 'hubot/robot';
	/**
	 * An adapter is a specific interface to a chat source for robots.
	 */
	export abstract class Adapter extends EventEmitter {
	    /**
	     * Initializes a new instance of the <<Adapter>> class.
	     * @param robot A robot instance
	     */
	    constructor(robot: Robot);
	    /**
	     * Raw method for sending data back to the chat source.
	     * @param envelope An object with message, room, and user details
	     * @param strings One or more strings for each message to send
	     */
	    abstract send(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * Raw method for building a reply and sending it back to the chat source.
	     * @param envelope An object with message, room, and user details
	     * @param strings One or more strings for each message to send
	     */
	    abstract reply(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * Raw method for invoking bot to run.
	     */
	    abstract run(): void;
	    /**
	     * Raw method for shutting the bot down.
	     */
	    abstract close(): void;
	    /**
	     * Raw method for setting a topic on the chat source.
	     * @param envelope An object with message, room, and user details
	     * @param strings One or more strings for each message to send
	     */
	    topic(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * Raw method for playing a sound in the chat source.
	     * @param envelope An object with message, room, and user details
	     * @param strings One or more strings for each message to send
	     */
	    play(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * Raw method for sending emote data back to the chat source. Defaults as an alias for send
	     * @param envelope A object with message, room, and user details
	     * @param strings One or more strings for each message to send
	     */
	    emote(envelope: Envelope, ...strings: string[]): void;
	    /**
	     * Dispatch a received message to the robot.
	     */
	    receive(message: Message): Promise<void>;
	}

}
declare module 'hubot' {
	import User from 'hubot/user';
	import Brain from 'hubot/brain';
	import Robot from 'hubot/robot';
	import { Adapter } from 'hubot/adapter';
	import Response from 'hubot/response';
	import { Listener, TextListener } from 'hubot/listener';
	import { Message, TextMessage, EnterMessage, LeaveMessage, TopicMessage, CatchAllMessage, Envelope } from 'hubot/message';
	export { User, Brain, Robot, Adapter, Response, Listener, TextListener, Message, TextMessage, EnterMessage, LeaveMessage, TopicMessage, CatchAllMessage, Envelope };
    export function loadBot(adapterPath: string, adapterName: string, enableHttpd: boolean, botName: string, botAlias: string): Robot;

}
/// <reference path="../typings/main.d.ts" />
declare module 'hubot/adapters/shell' {
	import Robot from 'hubot/robot';
	import { Adapter } from 'hubot/adapter';
	export function use(robot: Robot): Adapter;

}
