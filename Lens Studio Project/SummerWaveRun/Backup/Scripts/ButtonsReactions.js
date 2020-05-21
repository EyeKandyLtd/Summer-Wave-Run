//@input Component.ScriptComponent uiController
//@input int ActionCode

// IMPORTANT: MAKE SURE THAT THE BUTTON's EVENT IS CONFIGURED TO TAPPED

if(script.ActionCode == 0)
{
  StartGame();
}
else if(script.ActionCode == 1)
{
  script.uiController.api.PreviousGlasses();
}
else if(script.ActionCode == 2)
{
  script.uiController.api.NextGlasses();
}
