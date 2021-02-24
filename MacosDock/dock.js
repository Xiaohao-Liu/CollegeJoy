const default_option={
    icon_size:40,
    icon_padding:5,
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
        this.coverdom.onmousemove=(e)=>{
            this.__get_size(e.pageX)
        }
        this.coverdom.onmouseleave=()=>{
            this.reset_size();
        }
        this.dockdom.style.width=this.items.length * (this.icon_size + this.icon_padding*2)+"px";
        this.dockdom.style.height = (this.icon_padding*2 + this.icon_size) + "px";
        this.center();
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
        let left = this.icon_padding;
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
            item.index = index;
            item.position = itemdom.offsetLeft + this.dockdom.offsetLeft;
            index += 1;
            item.dom = itemdom;
            item.dom.style.left = left + "px";
            item.dom.style.bottom = this.icon_padding + "px";
            item.dom.style.width = this.icon_size + "px";
            item.dom.style.height = this.icon_size + "px";
            left += this.icon_size + this.icon_padding*2;
        });
    },
    __get_size:function(m){
        this.coverdom.style.height=(this.icon_size * (this.scale + 1) + this.icon_padding*2) + "px";
        this.coverdom.style.marginTop=-this.icon_size *(this.scale) + "px";
        let left = this.icon_padding;
        this.items.forEach(item => {
            item.position = item.dom.offsetLeft + this.dockdom.offsetLeft + .5*(this.icon_size + this.icon_padding*2);
            let scale_computed = Math.floor(this.gussion((item.position-m)/(item.dom.offsetWidth + this.icon_padding*2)) * 100) / 100
            let size = (scale_computed*this.scale + 1)*this.icon_size;
            item.dom.style.width = size + "px";
            item.dom.style.height = size + "px";
            
            item.dom.style.left = left + "px";
            left += size + this.icon_padding*2;
        });
        this.dockdom.style.width=left+"px";
        this.center(m);
    },
    reset_size:function(){
        let left = this.icon_padding;
        this.items.forEach(item => {
            let size = this.icon_size;
            item.dom.style.width = size + "px";
            item.dom.style.height = size + "px";
            item.dom.style.left = left + "px";
            left += this.icon_size + this.icon_padding*2;
        });
        this.dockdom.style.width=this.items.length * (this.icon_size + this.icon_padding*2)+"px";
        this.coverdom.style.height="100%";
        this.coverdom.style.marginTop="0px";
        this.center();
    }
}