// get cookie
export let getCookie = function(key){
    if (document.cookie.length>0) {
      let c_start=document.cookie.indexOf(key + "=")
        if (c_start!=-1){ 
          c_start=c_start + key.length+1 
          let c_end=document.cookie.indexOf(";",c_start)
          if (c_end==-1) c_end=document.cookie.length
          return unescape(document.cookie.substring(c_start,c_end))
        } 
      }
    return ""
};