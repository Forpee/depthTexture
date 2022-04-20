#include <packing>

uniform float cameraNear;
uniform float cameraFar;
uniform sampler2D depthInfo;

varying vec2 vUv;
float readDepth(sampler2D depthSampler,vec2 coord){
    float fragCoordZ=texture2D(depthSampler,coord).x;
    float viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);
    return viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
}
void main()
{
    // vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    // gl_PointSize=100.*(1./-mvPosition.z);
    float depth=readDepth(depthInfo,uv);
    vec3 pos = position;
    pos.z+=(1.-depth)*0.6;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    
    vUv=uv;
}