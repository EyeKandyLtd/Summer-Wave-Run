// TAP // MAKE SURE the script is set to execute on Tapped or Touch Ended/Started

//@input SceneObject[] enableList

script.getSceneObject().enabled = false;
script.getSceneObject().destroy();

for(var i=0; i<script.enableList.length; i++)
{
  script.enableList[i].enabled = true;
}
