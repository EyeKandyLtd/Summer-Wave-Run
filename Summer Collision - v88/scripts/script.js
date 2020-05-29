const Scene = require("Scene");
const Patches = require("Patches");
const Reactive = require('Reactive');

const Diagnostics = require('Diagnostics'); //REMOVE WHEN MOVED TO PROD

var initialLives = 3; //easier to work out with this for now

var life_counter_1 = Scene.root.find('lifevest_counter_1');
var life_counter_2 = Scene.root.find('lifevest_counter_2');
var life_counter_3 = Scene.root.find('lifevest_counter_3');

//life_counter_3.hidden = true; TO HIDE ON DEMAND

//Scene.root.find("2dText0").text = Patches.getScalarValue("score").toString();

Scene.root.find("2dText0").text = initialLives.toString();
Scene.root.find("2dText0").hidden = true;


Patches.setPoint2DValue("ob1", Reactive.point2d(Scene.root.find('plane0').transform.z, Scene.root.find('plane0').transform.x));
Patches.setPoint2DValue("ob2", Reactive.point2d(Scene.root.find('plane1').transform.z, Scene.root.find('plane1').transform.x));
Patches.setPoint2DValue("ob3", Reactive.point2d(Scene.root.find('plane2').transform.z, Scene.root.find('plane2').transform.x));
Patches.setPoint2DValue("ob4", Reactive.point2d(Scene.root.find('plane3').transform.z, Scene.root.find('plane3').transform.x));
Patches.setPoint2DValue("ob5", Reactive.point2d(Scene.root.find('plane4').transform.z, Scene.root.find('plane4').transform.x));
Patches.setPoint2DValue("ob6", Reactive.point2d(Scene.root.find('plane5').transform.z, Scene.root.find('plane5').transform.x));
Patches.setPoint2DValue("ob7", Reactive.point2d(Scene.root.find('plane6').transform.z, Scene.root.find('plane6').transform.x));
Patches.setPoint2DValue("ob8", Reactive.point2d(Scene.root.find('plane7').transform.z, Scene.root.find('plane7').transform.x));
Patches.setPoint2DValue("ob9", Reactive.point2d(Scene.root.find('plane8').transform.z, Scene.root.find('plane8').transform.x));

var number = Scene.root.find('score0');
var game_over = Scene.root.find('game_over');
var highest_score = Scene.root.find('highest_score');
var highest_score_score = Scene.root.find('highest_score_score');
var restart = Scene.root.find('restart');
var score = Patches.getScalarValue('distance');

var initialLives = 3;

Patches.getScalarValue("score").monitor().subscribe(function(event){
	if (event.newValue == 0) {
		life_counter_1.hidden = false;
		life_counter_2.hidden = false;
		life_counter_3.hidden = false;
	}

	if (event.newValue == -1) {
		life_counter_1.hidden = false;
		life_counter_2.hidden = false;
		life_counter_3.hidden = true;
	}

	if (event.newValue == -2) {
		life_counter_1.hidden = false;
		life_counter_2.hidden = true;
		life_counter_3.hidden = true;
	}

	if (event.newValue == -3) {
		life_counter_1.hidden = true;
		life_counter_2.hidden = true;
		life_counter_3.hidden = true;

		game_over.hidden = false;
		restart.hidden = false;
		highest_score.hidden = false;
		highest_score_score.hidden = false;
	}

	if(event.newValue > 0) {
		event.newValue = 0;
	}

	Diagnostics.log(event.newValue);
});

highest_score.text = 'Your Highest Score: ';
//highest_score.add(score.toString());

//Display score number
number.text = score.toString();

highest_score_score.text = score.toString();

//Diagnostics.log(number);
//Diagnostics.log(score);
//Diagnostics.log(Patches.getScalarValue("score"));