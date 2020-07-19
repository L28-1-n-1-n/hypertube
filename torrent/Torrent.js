const crypto = require('crypto');
const { Buffer } = require('buffer');
const Piece = require('torrent-piece');
const Tracker = require('bittorrent-tracker');
const pws = require('peer-wire-swarm');
//const Swarm = require('./Swarm');
const { EventEmitter } = require('events');
const fs = require('fs');

const parseTorrent = require('parse-torrent');
const path = require('path');

function verifyPiece(data, hash) {
	if (!(hash instanceof Buffer)) {
		hash = Buffer.from(hash, 'hex');
	}
	const toCheck = crypto.createHash('sha1').update(data).digest();
	if (toCheck.equals(hash)) {
		return true;
	}
	return false;
}

function savePiece(files, data, offset, dir = './') {
	for(file of files) {
		if (file.offset + file.length > offset) {
			const position = offset - file.offset;
			const fullPath = dir + file.path;
			const dirname = path.dirname(fullPath);
			if (!fs.existsSync(dirname)){
				fs.mkdirSync(dirname, {recursive: true});
			}
			const fd = fs.openSync(fullPath, 'a');
			if (fd >= 0) {
				let len = data.length;
				if (position + len > file.length) {
					len = file.length - position;
				}
				fs.writeSync(fd, data, 0, data.length, position);
				if (len < data.length) {
					data = data.slice(len);
					offset = file.offset + file.length;
				} else {
					return ;
				}
			}
		}
	}
}

function genId() {
	id = crypto.randomBytes(20);
	Buffer.from('-HT0002-').copy(id, 0);
	return id;
}

module.exports = class Torrent extends EventEmitter {
	constructor(data, port = 6889, dir = './') {
		super();
		const parsed = parseTorrent(data);
		console.log(parsed);
		this.infoHash = parsed.infoHashBuffer;
		this.announce = parsed.announce;
		this.peerId = genId();
		this.port = port;
		this.pieceLength = parsed.pieceLength;
		this.lastPieceLength = parsed.lastPieceLength;
		this.pieces = parsed.pieces;
		this.files = parsed.files;
		this.piecesLeft = this.pieces.length;
		this.needed = {};
		this.completed = new Promise((resolve, reject) => {
			this.once('completed', (files) => {
				resolve(files);
			});
		});
		//this.reserved = {};
		this.dir = dir;
		for (let i = 0; i < this.pieces.length; i++) {
			const len = i == this.pieces.length - 1 ? this.lastPieceLength : this.pieceLength;
			this.needed[i] = new Piece(len);
		}
		this.tracker = new Tracker({
			infoHash: this.infoHash,
			announce: this.announce,
			peerId: this.peerId,
			port: this.port
		});
		this.tracker.on('error', console.log);
		this.tracker.on('warning', console.log);
		this.swarm = null;
		this.engine = new EventEmitter();
	}

	start() {
		this.engine.on('available', (wire) => {
			if (!wire.peerChoking) {
				//console.log(wire.peerPieces);
				for (const index in this.needed) {
					const pieceIndex = Number(index);
					if (wire.peerPieces[pieceIndex]) {
						const piece = this.needed[pieceIndex];
						const blockIndex = piece.reserve();
						if (blockIndex >= 0) {
							//console.log('block:', blockIndex);
							const offset = piece.chunkOffset(blockIndex);
							const len = piece.chunkLength(blockIndex);
							//console.log('Requesting (index / offset / len):', pieceIndex , offset, len);
							//console.log(wire);
							wire.request(pieceIndex , offset, len, (err, block) => {
								//console.log('WOLOLOLO');
								//console.log(err);
								if (err) {
									piece.cancel(blockIndex);
									setTimeout(() => {
										this.engine.emit('available', wire);
									}, 5000);
								} else {
									//console.log('Received (piece index / block index):', pieceIndex, blockIndex);
									piece.set(blockIndex, block);
									if (piece.missing === 0) {
										const data = piece.flush();
										if (verifyPiece(data, this.pieces[pieceIndex])) {
											delete this.needed[pieceIndex];
											this.piecesLeft--;
											console.log('Piece', pieceIndex, 'OK /', this.piecesLeft, 'left');
											savePiece(this.files, data, pieceIndex * this.pieceLength, this.dir);
											if (this.piecesLeft <= 0) {
												this.emit('completed', this.files);
											}
										} else {
											console.log('Piece', pieceIndex, 'KO');
											this.needed[pieceIndex] = new Piece(piece.length);
										}
										//process.exit(0);
									}
									this.engine.emit('available', wire);
								}
							});
							return ;
						}
					}
				}
			}
		});
		const swarmOptions = {
		}
		this.swarm = pws(this.infoHash, this.peerId, swarmOptions);
		this.swarm.on('wire', (wire) => {
			wire.setTimeout(5000);
			wire.on('have', function (piece) {
				//console.log('have');
			});
			wire.on('unchoke', () => {
				console.log('unchoke', wire.peerAddress);
				this.engine.emit('available', wire);
			});
			console.log('sending interested');
			wire.interested();
		});
		this.swarm.listen(this.port)
		this.tracker.on('peer', (peer) => {
			console.log(peer);
			this.swarm.add(peer);
		});
		/*this.tracker.on('scrape', (data) => {
			console.log(data);
		});
		this.tracker.scrape();*/
		this.tracker.start();
	}

	/*start() {
		this.swarm = new Swarm(this.infoHash, this.peerId);
		this.swarm.on('available', (peer) => {
			console.log('available:', peer.peerId);
			const wire = peer.wire;
			if (!wire.peerChoking) {
				for (const pieceIndex in this.needed) {
					if (wire.peerPieces[pieceIndex]) {
						const piece = this.needed[pieceIndex];
						const blockIndex = piece.reserve();
						if (blockIndex >= 0) {
							console.log('block:', blockIndex);
							const offset = piece.chunkOffset(blockIndex);
							const len = piece.chunkLength(blockIndex);
							console.log('Requesting (index / offset / len):', pieceIndex , offset, len);
							//console.log(wire);
							peer.wire.request(pieceIndex , offset, len, (err, block) => {
								//console.log('WOLOLOLO');
								console.log(err);
								if (err) {
									piece.cancel(blockIndex);
									setTimeout(() => {
										this.swarm.emit('available', peer);
									}, 10000);
								} else {
									console.log('Received (piece index / block index):', pieceIndex, blockIndex);
									piece.set(blockIndex, block);
									if (piece.missing === 0) {
										const data = piece.flush();
										if (verifyPiece(data, this.pieces[pieceIndex])) {
											delete this.needed[pieceIndex];
											console.log('Piece', pieceIndex, 'OK');
										} else {
											console.log('Piece', pieceIndex, 'KO');
											this.needed[pieceIndex] = new Piece(piece.length);
										}
									}
									this.swarm.emit('available', peer);
								}
							});
							return ;
						}
					}
				}
			}
			// const wire = peer.wire;
			// if (!wire.peerChoking) {
			// 	for (const index in this.needed) {
			// 		const pieceIndex = Number(index);
			// 		console.log(pieceIndex, typeof pieceIndex);
			// 		if (wire.peerPieces[pieceIndex]) {
			// 			const piece = this.needed[pieceIndex];
			// 			const blockIndex = piece.reserve();
			// 			const offset = piece.chunkOffset(blockIndex);
			// 			const len = piece.chunkLength(blockIndex);
			// 			console.log('Requesting (index / offset / len):', pieceIndex , offset, len);
			// 			wire.request(pieceIndex , offset, len, (err, block) => {
			// 				console.log(err, block);
			// 			});
			// 			break ;
			// 		}
			// 	}

			// }

		});
		this.tracker.on('peer', (peer) => {
			console.log(peer);
			this.swarm.add(peer);
		});
		this.tracker.start();
	}*/

	stop() {
		this.tracker.stop();
		delete this.swarm;
	}

}
