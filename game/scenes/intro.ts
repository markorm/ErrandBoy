/* Intro Scene */
let intro:any = {};
let __intro = () => { intro.showTitle(); };

// Show the title screen
intro.showTitle = () => {

	// Play the intro music and draw the background
	audio.PlayMusic("tea-garden.mp3");
	ui.Background("intro-splash.jpg");

	// Fade in the screen, then show the titlecard.
	// The titlecard has an onevent attribute that will listen for the specified
	// ...event and then execute callbacks for all listeners
	ui.animate.FadeIn(ui.screen, 4000).then(() => {

		let introCard =
		`<div id="introCard">
	          <div class="title">${game.description.title}</div>
	          <div class="prompt">Press any key to Continue...</div>
	    </div>`;



		// // Draw the Dialog and listen for a keypress
		// ui.DrawDialog(introCard).then(($introCard:HTMLElement) => {
		// 	ui.animate.FadeIn($introCard, 1000).then();
		// 	events.On("keypress", () => {
		// 		audio.PlaySound("Accept.mp3");
		// 		ui.animate.FadeOut($introCard, 1000).then(() => {
		// 			ui.RemoveDialog($introCard);
		// 			intro.playerSelection();
		// 		});
		// 	});
		// });

	});
};

// Show the player selection screen
// The load player option is contingent upon a local player...
// being found, this is defined with the data-if query
intro.playerSelection = () => {

	// Listen to the game start event
	// Show the player selection dialog
	let playerSelection =
	`<div id="playerSelection" class="selection">
		<div class="title">${game.description.title}</div>
		<button class="positive"
			data-onevent="click"
			data-doevent="new-player">
			New Game
		</button>
		<button class="positive"
			data-if="player.local"
			data-onevent="click"
			data-doevent="load-player">
			Load Game
		</button>
	</div>`;

	// Show the player selection screen and listen for triggered events
	ui.DrawDialog(playerSelection).then(($playerSelection:HTMLElement) => {
		ui.animate.FadeIn($playerSelection, 1000).then();

		// New Player Selection
		events.On("new-player", (e) => {
			ui.animate.FadeOut($playerSelection, 1000).then(() => {
				ui.RemoveDialog($playerSelection);
				intro.createCharacter();
			})
		});

		// Load Player Selection
		events.On("load-player", (e) => {
			player.Load();
			game.LoadScene(player.currentScene);
		});

	});

};

// Create a new character
intro.createCharacter = () => {

	let newCharacter =
	`<div id="character-creator" class="game-form" >
		<div class="form-title">Create a new character</div>
		<input data-player="name" autocomplete="false"/>
		<button data-onevent="click" data-doevent="create-character">Create Character</button>
	</div>`;

	ui.DrawDialog(newCharacter).then(($newCharacter:HTMLElement) => {
		ui.animate.FadeIn($newCharacter, 1000).then();
		events.On("create-character", () => {
			player.New($newCharacter);
			ui.animate.FadeOut($newCharacter, 1000).then(() => {
				ui.RemoveDialog($newCharacter);
				intro.backStory();
			});
		});
	});

};

// Show Backstory
intro.backStory = () => {



};