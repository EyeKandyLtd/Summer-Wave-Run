

// Get the Particle's Mesh Visual
var meshVis = script.getSceneObject().getFirstComponent("Component.MeshVisual");
// Variable to store what time particle started
var startTime;
// Update the particle time every frame when needed



function update()
{
    if (startTime) 
    {
        // Calculate how many seconds have elapsed since we've triggered particles
        var particleTime = getTime() - startTime;
        // Pass it in to our Particle Material
        meshVis.mainPass.externalTimeInput = particleTime; 
    }
}
var updateEvent = script.createEvent("UpdateEvent");
if (meshVis != null) updateEvent.bind(update);


function startParticle()
{
    startTime = getTime();
}
startParticle();

//var startParticleEvent = script.createEvent("xx");
//startParticleEvent.bind(startParticle);

