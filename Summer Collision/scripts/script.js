const Scene = require("Scene");
const Patches = require("Patches");
const Reactive = require('Reactive');

Scene.root.find("2dText0").text = Patches.getScalarValue("score").toString();


Patches.setPoint2DValue("ob1", Reactive.point2d(Scene.root.find('plane0').transform.z, Scene.root.find('plane0').transform.x));
Patches.setPoint2DValue("ob2", Reactive.point2d(Scene.root.find('plane1').transform.z, Scene.root.find('plane1').transform.x));
Patches.setPoint2DValue("ob3", Reactive.point2d(Scene.root.find('plane2').transform.z, Scene.root.find('plane2').transform.x));
Patches.setPoint2DValue("ob4", Reactive.point2d(Scene.root.find('plane3').transform.z, Scene.root.find('plane3').transform.x));
Patches.setPoint2DValue("ob5", Reactive.point2d(Scene.root.find('plane4').transform.z, Scene.root.find('plane4').transform.x));
Patches.setPoint2DValue("ob6", Reactive.point2d(Scene.root.find('plane5').transform.z, Scene.root.find('plane5').transform.x));
Patches.setPoint2DValue("ob7", Reactive.point2d(Scene.root.find('plane6').transform.z, Scene.root.find('plane6').transform.x));
Patches.setPoint2DValue("ob8", Reactive.point2d(Scene.root.find('plane7').transform.z, Scene.root.find('plane7').transform.x));

var number = Scene.root.find('score0');
var score = Patches.getScalarValue('distance');


//Display score number
number.text = score.toString();