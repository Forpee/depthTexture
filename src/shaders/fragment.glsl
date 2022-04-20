#include <packing>

uniform float uTime;
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
    // gl_FragColor=vec4(vUv,1.,1.);
    float depth=readDepth(depthInfo,vUv);
    
    gl_FragColor.rgb=1.-vec3(depth);
    gl_FragColor.a=1.;
}