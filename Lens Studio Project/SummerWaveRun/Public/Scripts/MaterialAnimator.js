// -----JS CODE-----


var renderer = script.getSceneObject().getComponent("Component.RenderMeshVisual");
var material = renderer.getMaterial(0);
var pass = material.getPass(0);


script.api.SetScrollDirection_UV2 = function(x, y) {
    pass.uv2Offset = new vec2(x,y);
}

script.api.SetScrollDirection_UV3 = function(x, y) {
    pass.uv3Offset = new vec2(x,y);
}

script.api.SetScale_UV2 = function(x, y) {
    pass.uv2Scale = new vec2(x,y);
}

script.api.SetScale_UV3 = function(x, y) {
    pass.uv3Scale = new vec2(x,y);
}
