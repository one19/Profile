var app = app || {};

app.init = function () {
  console.log('inited');

  app.width = window.innerWidth;
  app.height = window.innerHeight;

  //angle
  //window size ratio
  //near - render closest distance 'units'
  //far - render load distance in 'units'
  app.camera = new THREE.PerspectiveCamera( 45, app.width / app.height, 1, 1000 );
  app.camera.position.z = 200;

  app.scene = new THREE.Scene();
  app.scene.add( app.camera );

  app.renderer = new THREE.WebGLRenderer();
  app.renderer.setSize( app.width, app.height );
  app.renderer.setClearColor( 0xE3F2FD, 1 ); //hex code and transparency

  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );

  document.body.appendChild( app.renderer.domElement );
  //scene, and a camera
  //app.renderer.render( app.scene, app.camera );

  app.addBox();
  app.addSphere();
  app.animate();

  //console.log( app.renderer );
}

app.addBox = function () {
  var shape = new THREE.BoxGeometry( 20, 20, 20 );
  var material = new THREE.MeshBasicMaterial( {
    color: 0x1A237E,
    wireframe: true
  } );
  app.cube = new THREE.Mesh( shape, material );

  app.scene.add( app.cube );
  //app.renderer.render( app.scene, app.camera );
}

app.addSphere = function () {
  //radius
  //amount of segment
  //amount of rings
  var shape = new THREE.SphereGeometry( 50, 16, 16 );
  var material = new THREE.MeshBasicMaterial( {
    color: 0xEC407A,
    wireframe: true
  } );
  app.sphere = new THREE.Mesh( shape, material );
  app.scene.add( app.sphere );
}

//we used to redraw the page every damn time, and it sucks because there's so much shit to do
//now we've got around this (in 2011) --requestAnimationFrame
app.animate = function () {
  requestAnimationFrame( app.animate );

  app.cube.rotation.x += 0.05;
  app.cube.rotation.y += 0.05;
  app.cube.rotation.z += 0.05;

  app.sphere.rotation.y += 0.005;

  app.renderer.render(app.scene, app.camera);
}

window.onload = app.init;

window.addEventListener( "mousemove", function( event ) {
  //console.log( event );
  app.cube.position.x = 0.21 * ( event.clientX - ( app.width / 2 ) );
  app.cube.position.y = -0.21 * ( event.clientY - ( app.height / 2 ) );
})

window.addEventListener( "resize", function() {
  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();

  app.renderer.setSize( app.width, app.height );
})

//this is the same as:
// window.onload = function() {
//   app.init
// }