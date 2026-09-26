export const isCloudinaryImage=(url:string)=>url.startsWith('https://res.cloudinary.com/')&&url.includes('/image/upload/');

export const cloud=(url:string,width=1200)=>{
  if(!isCloudinaryImage(url))return url;
  const marker='/image/upload/';
  const index=url.indexOf(marker)+marker.length;
  const prefix=url.slice(0,index);
  const path=url.slice(index).replace(/^f_auto,q_auto(?:,[^/]*)?\//,'');
  return `${prefix}f_auto,q_auto,c_limit,w_${width}/${path}`;
};

export const cloudVideoPoster=(url:string,width=800)=>
  url.startsWith('https://res.cloudinary.com/')&&url.includes('/video/upload/')
    ?url.replace('/video/upload/',`/video/upload/so_0,f_jpg,q_auto,w_${width}/`)
    :undefined;
