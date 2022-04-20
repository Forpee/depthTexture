#include <packing>

uniform float uTime;
uniform float cameraNear;
uniform float cameraFar;
uniform sampler2D depthInfo;

varying vec2 vUv;
varying vec2 vUv1;
varying float vDepth;


float readDepth(sampler2D depthSampler,vec2 coord){
    float fragCoordZ=texture2D(depthSampler,coord).x;
    float viewZ=perspectiveDepthToViewZ(fragCoordZ,cameraNear,cameraFar);
    return viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
}

void main()
{
    // gl_FragColor=vec4(vUv,1.,1.);
    float depth=readDepth(depthInfo,vUv);
    float tomix = smoothstep(0.5, 0.1, vDepth);

    gl_FragColor.rgb=mix(vec3(0.5, 0.16, 0.23), vec3(0., 0., 0.24), vDepth);
    gl_FragColor.a=1.;
}