import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import cloudinary from 'cloudinary';
import path from 'path';
import os from 'os';
import fs from 'fs';
import axios from 'axios';
import adjustFontSize from '../utils';

const cl = cloudinary.v2;
cl.config({
  cloud_name: 'vladacloud',
  api_key: '484979216774377',
  api_secret: '-ru-0RFmsp8IehdXBXJdNzZQ-R8'
});

export class ImagesRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'ImageRoutes');
  }

  configureRoutes() {
    this.app.route('/images').get(async (req: express.Request, res: express.Response) => {
      let text: any = req.query.text;
      let bg: any = req.query.bg;
      if (!text || !bg) {
        return res.status(403).send('Invalid Request!');
      }
      // Share_gratitude_8_itnkoc
      // 'This%20is%20an%20example%20of%20a%20long%20textThis%20is%20an%20example%20of%20a%20long%20textThis%20is%20an%20example%20of%20a%20long%20textThis%20is%20an%20example%20of%20a%20long%20textThis%20is%20an%20example%20of%20a%20long%20t'
      try {
        console.log('==========text:', decodeURI(text));
        const fontSize = adjustFontSize(decodeURI(text));
        console.log('fontSize:', fontSize);
        let imageUrl = await cl.url(`kai_bg/${bg}.png`, {
          transformation: [
            {
              overlay: {
                font_family: 'Recoleta-Medium.otf',
                font_size: fontSize,
                font_weight: 'bold',
                text: text,
                text_align: 'center'
              },
              color: '#3E3330',
              width: 400,
              height: 400,
              crop: 'fit',
              gravity: 'center'
            }
          ]
        });
        imageUrl = imageUrl.replace(/^http:/, 'https:');
        console.log('=============== url:', imageUrl);
        // const uploadResult = await cl.uploader.upload(
        //   imageUrl,
        //   { ocr: 'adv_ocr', public_id: 'kai_temp' }
        // );
        // console.log('++++++++++++++OCR result:', uploadResult);
        // const updateResult = await cl.api.update('kai_temp', { ocr: 'adv_ocr' });
        // console.log('++++++++++++++OCR result:', updateResult);

        const dest = path.join(os.tmpdir(), '');
        // console.log('dest:', dest);
        const result = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(`${dest}/image.png`, result.data);
        const stat = fs.statSync(`${dest}/image.png`);
        res.setHeader('Content-Description', 'File Transfer');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-type', 'image/png');
        res.setHeader('Content-disposition', 'inline;filename="image.png"');
        return res.status(200).sendFile(`${dest}/image.png`);
      } catch (e) {
        console.log('e', e);
        return res.status(500).send('Internal Server Error');
      }
    });
    return this.app;
  }
}
