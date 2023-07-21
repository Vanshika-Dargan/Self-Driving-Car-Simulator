class Visualizer{

    static drawNetwork(ctx,network)
    {
        const margin=50;
        const top=margin;
        const left=margin;
        const width=ctx.canvas.width-margin*2;
        const height=ctx.canvas.height-margin*2;


        const levelHeight=height/network.levels.length;

         for(let i=network.levels.length-1;i>=0;i--){
            const levelTop=top+
       linearInterpolate(height-levelHeight,0,
               network.levels.length==1?0.5:
               i/(network.levels.length-1));
                Visualizer.drawLevel(ctx,network.levels[i],
                 left,levelTop,width,levelHeight,
                 i==network.levels.length-1?
                 ['F','L','R','B']:[]);
        }
    }

    static drawLevel(ctx,level,left,top,width,height,outputLabels)
    {
    const right=left+width;
    const bottom=top+height;

    const nodeRadius=18;
    
    const {inputs,outputs,weights,biases}=level;
    
    for(let i=0;i<inputs.length;i++)
    {
        for(let j=0;j<outputs.length;j++)
        {
            ctx.beginPath();
            ctx.moveTo(Visualizer.#getNodeCenterX(
                left,right,i,inputs
            ),bottom);
            ctx.lineTo(Visualizer.#getNodeCenterX(
                left,right,j,outputs
            ),top);
            ctx.lineWidth=2;
            ctx.strokeStyle=getRGBA(weights[i][j]);
           ctx.stroke();
        }
    }
    for(let i=0;i<inputs.length;i++)
    {
       
        ctx.beginPath();
        ctx.arc(Visualizer.#getNodeCenterX(
            left,right,i,inputs
        ),bottom,nodeRadius,0,Math.PI*2);
        ctx.fillStyle="black";
        ctx.fill();
            ctx.beginPath();
            ctx.arc(Visualizer.#getNodeCenterX(
                left,right,i,inputs
            ),bottom,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.fill();
            

    }
    for(let i=0;i<outputs.length;i++)
    {
        const x=Visualizer.#getNodeCenterX(
            left,right,i,outputs
        );   
        ctx.beginPath();
        ctx.arc(x,top,nodeRadius,0,Math.PI*2);
        ctx.fillStyle="black";
        ctx.fill();
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.fill();
       
           ctx.beginPath();
           ctx.lineWidth=2;
           ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
           ctx.strokeStyle=getRGBA(biases[i]);
           ctx.setLineDash([3,3]);
           ctx.stroke();
           ctx.setLineDash([]);
           
           if(outputLabels[i]){
           ctx.beginPath();
         ctx.textAlign="center";
        ctx.textBaseLine="middle";
        ctx.fillStyle="black";
        ctx.strokeStyle="white";
        ctx.font=(nodeRadius*1.0)+"px Arial";
        ctx.fillText(outputLabels[i],x,top+nodeRadius*0.2);
        ctx.lineWidth=0.5;
        ctx.strokeText(outputLabels[i],x,top+nodeRadius*0.2);
           }
           }
    }

    

    static #getNodeCenterX(left,right,i,nodes)
    {
       return linearInterpolate(left,right,
        nodes.length==1?0.5:i/(nodes.length-1)
        ); 
    }
}