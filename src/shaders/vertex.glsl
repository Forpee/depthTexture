#include <packing>

uniform float cameraNear;
uniform float cameraFar;
uniform sampler2D depthInfo;

varying vec2 vUv;
varying vec2 vUv1;

attribute float y;

float readDepth(sampler2D depthSampler,vec2 coord){
    float fragCoordZ=texture2D(depthSampler,coord).x;
    float viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);
    return viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
}
void main()
{
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    vec2 vUv1 = vec2(uv.x, y);
    
    float depth=readDepth(depthInfo,vUv1);
    vec3 pos = position;


    pos.z+=(1.-depth);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    
    vUv=uv;
}