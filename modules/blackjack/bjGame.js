const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const currency = require('../../modules/database/currency.js');
const { poker } = require('./poker.js');

class Blackjack {
	constructor(guildID) {
		this.guildID = guildID;
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		this.CS = new currency.system(guildID);
		this.deckNum = 4;
		this.shuffleTimes = 1000;
	}
	isGameExist() {
		if(this.gameFile[this.guildID]) return true;
		else return false;
	}
	initGame() {
		const deck = new poker().buildDeck(this.deckNum, this.shuffleTimes);
		const game = {
			dealerHand: [],
			playerList: [],
			deck: deck,
			pending: true
		}
		this.gameFile[this.guildID] = game;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
	startGame(message) {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		if(this.gameFile[this.guildID].playerList === 0) {
			delete this.gameFile[this.guildID];
			message.channel.send('人數不足!');
		}
		const infoEmbed = new MessageEmbed().setColor('#0000FF').setTitle('牌局開始')
			.setDescription(`<@${this.gameFile[this.guildID].playerList[0].id}> 的回合`);
		this.gameFile[this.guildID].dealerHand.push(this.gameFile[this.guildID].deck.pop());
		infoEmbed.addField('Dealer', `${this.gameFile[this.guildID].dealerHand[0].symbol}${this.gameFile[this.guildID].dealerHand[0].value}\n${this.gameFile[this.guildID].dealerHand[1].symbol}${this.gameFile[this.guildID].dealerHand[1].value}`);
		for(const user of this.gameFile[this.guildID].playerList) {
			user.hand.push(this.gameFile[this.guildID].deck.pop());
			user.hand.push(this.gameFile[this.guildID].deck.pop());
			infoEmbed.addField(`<@${user.id}>`, `${user.hand[0].symbol}${user.hand[0].value}\n${user.hand[1].symbol}${user.hand[1].value}`);
		}
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
		
		message.channel.send({ embeds: [infoEmbed] });
	}
	hit() {

	}
	stand() {

	}
	doubleDown() {

	}
	endGame() {
		
	}
	addPlayer(userID, bets) {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		const player = {
			id: userID,
			hand: [],
			bets: bets,
			done: false,
			bust: false
		}
		this.gameFile[this.guildID].playerList.push(player);
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
	renewDeck() {
		const deck = new poker().buildDeck(this.deckNum, this.shuffleTimes);
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		this.gameFile[this.guildID].deck = deck;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
	stopPending() {
		this.gameFile = JSON.parse(fs.readFileSync('./modules/blackjack/game.json', 'utf-8'));
		this.gameFile[this.guildID].pending = false;
		fs.writeFileSync('./modules/blackjack/game.json', JSON.stringify(this.gameFile, null, 4), (err) => {
			if(err) console.log(err);
		});
	}
}

module.exports.Blackjack = Blackjack;