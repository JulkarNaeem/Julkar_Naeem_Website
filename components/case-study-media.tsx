type ApprovedDrawingCropProps={
  imageUrl?:string;
  caption?:string;
  alt?:string;
};

function isApprovedImageUrl(value:string){
  try{
    const url=new URL(value);
    return url.protocol==='https:';
  }catch{
    return false;
  }
}

export function ApprovedDrawingCrop({imageUrl='',caption='',alt='Approved sanitized drawing crop'}:ApprovedDrawingCropProps){
  const approvedUrl=imageUrl.trim();
  const approvedCaption=caption.trim();
  if(!approvedUrl||!approvedCaption||!isApprovedImageUrl(approvedUrl)) return null;

  return (
    <figure className="approved-drawing-crop">
      <img src={approvedUrl} alt={alt} width={1600} height={1000} loading="lazy" decoding="async"/>
      <figcaption>{approvedCaption}</figcaption>
    </figure>
  );
}
