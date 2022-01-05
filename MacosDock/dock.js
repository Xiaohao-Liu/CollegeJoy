const default_option={
    icon_size:50,
    scale:1.5
}

function  MacDock(dockdom,items,option={}){
    // this.option = option;
    for(let k in default_option)this[k] = default_option[k];
    for(let k in option)this[k] = option[k];
    this.dockdom = dockdom;
    this.items = items;
    this.scale -= 1;
    this.__init();
    
}
MacDock.prototype={
    __init:function(){
        this.coverdom = document.createElement("div");
        this.dockdom.appendChild(this.coverdom);
        this.coverdom.setAttribute("class","cover")
        this.__add_items();
        this.dockdom.onmousemove=(e)=>{
            this.__get_size(e.pageX)
        }
        this.dockdom.onmouseleave=()=>{
            this.reset_size();
        }
        this.compute_parameters()
    },
    compute_parameters:function(){
        this.original_width = this.items.length * (this.icon_size );
        this.dockdom.style.width= this.original_width+"px";
        
        this.dockdom.style.height = (this.icon_size) + "px";
        this.center();
        this.original_left = this.dockdom.offsetLeft;
        this.half_scaled_size = this.__get_size(this.dockdom.offsetLeft);
        this.reset_size();
    },
    center:function(m){
        let domW = this.dockdom.offsetWidth;
        // let screenW = window.innerWidth;
        this.dockdom.style.marginLeft = -(domW/2) + "px";
    },
    gussion:function(x){
        return Math.exp(-Math.pow(x,2)/8)
    },
    __add_items:function(){
        let index = 0;
        let left = 0;
        this.items.forEach(item => {
            const itemdom = document.createElement("div");
            this.coverdom.appendChild(itemdom);
            itemdom.style.backgroundImage="url("+item.icon+")";
            itemdom.setAttribute("class","item")
            const itemdomtitle = document.createElement("div");
            itemdom.appendChild(itemdomtitle);
            itemdomtitle.setAttribute("class","title");
            itemdomtitle.innerText=item.title;
            itemdomtitle.style.marginLeft=-(itemdomtitle.offsetWidth/2) + "px";
            console.log(itemdomtitle)
            item.index = index;
            item.position = itemdom.offsetLeft + this.dockdom.offsetLeft;
            index += 1;
            item.dom = itemdom;
            item.dom.style.left = left + "px";
            item.dom.style.bottom = 0 + "px";
            item.dom.style.width = this.icon_size + "px";
            item.dom.style.height = this.icon_size + "px";
            left += this.icon_size;
        });
    },
    __get_size:function(m){
        let left_offset = 0
        this.coverdom.style.height=(this.icon_size * (this.scale + 1) ) + "px";
        this.coverdom.style.marginTop=-this.icon_size *(this.scale) + "px";
        let left = 0;
        this.items.forEach((item) => {
            let scale_computed = Math.floor(this.gussion((item.position-m)/(this.icon_size)) * 1000) / 1000

            let scale_size = (scale_computed*this.scale)*this.icon_size;
            let size = scale_size + this.icon_size;
            item.dom.style.width = size + "px";
            item.dom.style.height = size + "px";
            
            item.dom.style.left = left + "px";
            left += size;
            if(m-item.position<-this.icon_size/2){

            }else if(m-item.position<this.icon_size/2){
                left_offset += ((m - item.position )/this.icon_size + 0.5)*scale_size;
            }
            else if(m-item.position>=this.icon_size/2){
                left_offset += scale_size;
            }

        });
        this.dockdom.style.width=left+"px";
        this.dockdom.style.marginLeft=(-left_offset - this.original_width/2)+"px";
        return left;
    },
    reset_size:function(){
        let left = 0;
        this.items.forEach(item => {
            let size = this.icon_size;
            item.dom.style.width = size + "px";
            item.dom.style.height = size + "px";
            item.dom.style.left = left + "px";
            item.position = this.original_left + left + this.icon_size*0.5;
            left += this.icon_size;
        });
        this.dockdom.style.width=this.items.length * (this.icon_size)+"px";
        this.dockdom.style.height = this.icon_size + "px";
        this.coverdom.style.height="100%";
        this.coverdom.style.marginTop="0px";
        this.center();
    }
}
