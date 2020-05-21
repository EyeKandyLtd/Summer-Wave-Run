/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');
const Patches = require('Patches');
// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

//require facetracking for Jumping
const FaceTracking = require('FaceTracking');
const Reactive = require('Reactive');
const TouchGestures = require('TouchGestures');
const Animation = require('Animation');

const Time = require('Time');

const number = Scene.root.find('number');
//let score = Animation.getScalarValue(score);

//Display score number
//number.text = score.toString();

const character = Scene.root.find('jetski_character');

const characterInitialYPos = character.transform.y.pinLastValue();

const characterEndYPos = character.transform.y.mul(-4).pinLastValue();

const animationParams = {
	durationMilliseconds: 500,
	mirror: true
};

const timeDriver = Animation.timeDriver({durationMilliseconds: 500});

let linearSampler = Animation.samplers.linear(characterInitialYPos,characterEndYPos);

const mouthOpenness = FaceTracking.face(0).mouth.openness;

//const mouthOpennessPlusOne = mouthOpenness.add(1);

const mouthOpennessValue = FaceTracking.face(0).mouth.openness.pinLastValue();

Diagnostics.log(mouthOpennessValue);

mouthOpenness.monitor().subscribe(function(event) {
  if(event.newValue > 0.4) {
  	
	linearSampler = Animation.samplers.linear(character.transform.y.pinLastValue(), 70);
	
	character.transform.y = Animation.animate(timeDriver,linearSampler);
	timeDriver.start();

	Time.setTimeout(function(){
		timeDriver.reset();
	}, 500); 
  }
});

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

// To access scene objects
// const directionalLight = Scene.root.find('directionalLight0');

// To access class properties
// const directionalLightIntensity = directionalLight.intensity;

// To log messages to the console
// Diagnostics.log('Console message logged from the script.');
