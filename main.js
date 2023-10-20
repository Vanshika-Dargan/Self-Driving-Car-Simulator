const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;


const carCtx=carCanvas.getContext("2d");
const networkCtx=networkCanvas.getContext("2d");

const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

// 1000 cars in parallel
const N=1000;
const cars=generateParallelCars(N);

// const car=new Car(road.getLaneCenter(1),100,30,50,"AI");

let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem('bestBrain')
        )
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}
const traffic=[
    
    new Car(road.getLaneCenter(1),-100,30,50,"TRAFFIC",2),
    new Car(road.getLaneCenter(0),-300,30,50,"TRAFFIC",2),
    new Car(road.getLaneCenter(2),-300,30,50,"TRAFFIC",2),
    new Car(road.getLaneCenter(0),-300,30,50,"TRAFFIC",2),
    new Car(road.getLaneCenter(1),-500,30,50,"TRAFFIC",2),
    new Car(road.getLaneCenter(1),-700,30,50,"TRAFFIC",2),
    new Car(road.getLaneCenter(2),-700,30,50,"TRAFFIC",2),
];
animate();

function saveGoodCar()
{
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discardNotUsefulCar(){
   localStorage.removeItem("bestBrain");
}

// parallelization
function generateParallelCars(N)
{
const cars=[];
for(let i=1;i<=N;i++)
{
    // Car(road's 1st lane center,100 in y axis, 30 width , 50 height, AI cars)
    cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
}
return cars;
}

function animate(time)
{

for(let i=0;i<traffic.length;i++)
{
traffic[i].update(road.borders,[]);
}

for(let i=0;i<cars.length;i++)
{
cars[i].update(road.borders,traffic);
}

// the most interesting car is the one with minimum y value
bestCar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));

carCanvas.height=window.innerHeight;
networkCanvas.height=window.innerHeight;
carCtx.save();
carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
road.draw(carCtx);
for(let i=0;i<traffic.length;i++)
{
traffic[i].draw(carCtx,"green");
}
carCtx.globalAlpha=0.2;
for(let i=1;i<cars.length;i++)
{
cars[i].draw(carCtx,"blue",false);
}
carCtx.globalAlpha=1;
bestCar.draw(carCtx,"blue",true);
carCtx.restore();


networkCtx.lineDashOffset=-time/50;
Visualizer.drawNetwork(networkCtx,bestCar.brain)
requestAnimationFrame(animate);
}