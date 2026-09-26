import test from 'node:test';
import assert from 'node:assert/strict';
import {cloud,cloudVideoPoster} from '../lib/cloudinary.ts';

test('CMS image URLs receive an actual width and format transformation',()=>{
  const original='https://res.cloudinary.com/julkarnaeem/image/upload/v1789707919/frame.png';
  assert.equal(cloud(original,800),'https://res.cloudinary.com/julkarnaeem/image/upload/f_auto,q_auto,c_limit,w_800/v1789707919/frame.png');
  assert.equal(cloud(cloud(original,1200),480),'https://res.cloudinary.com/julkarnaeem/image/upload/f_auto,q_auto,c_limit,w_480/v1789707919/frame.png');
  assert.equal(cloud('/local.webp',800),'/local.webp');
});

test('Cloudinary videos use a poster without downloading the movie',()=>{
  assert.equal(cloudVideoPoster('https://res.cloudinary.com/julkarnaeem/video/upload/v1/frame.mp4'),
    'https://res.cloudinary.com/julkarnaeem/video/upload/so_0,f_jpg,q_auto,w_800/v1/frame.mp4');
});
