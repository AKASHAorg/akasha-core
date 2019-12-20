import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import { existsSync, mkdir, mkdirSync, open, readdir, readFile, writeFile } from 'fs';
import { join } from 'path';
import lockfile from 'proper-lockfile';

const writeToFile = ({ filePath, data }: { filePath: string; data: any }) =>
  new Promise((resolve, reject) => {
    const str = JSON.stringify(data, null, 2);
    writeFile(filePath, str, err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

const strTrans = ({ filePath, data }: { filePath: string; data: any }) => {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, fileContent) => {
      if (err) {
        return reject(err);
      }
      const json = Object.assign(JSON.parse(fileContent), data);
      return resolve({
        data: json,
        filePath: filePath,
      });
    });
  });
};

const localesDir = join(__dirname, '../../../locales');
if (!existsSync(localesDir)) {
  mkdirSync(localesDir);
}

const app = express();

const cors = (_: Request, res: Response, next: NextFunction) => {
  res.header('access-control-allow-origin', '*');
  next();
};

const ensureFolderExists = (path: string) =>
  new Promise((resolve, reject) => {
    readdir(path, err => {
      if (err) {
        mkdir(path, error => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      } else {
        resolve();
      }
    });
  });

const ensureFileExists = (path: string) =>
  new Promise((resolve, reject) => {
    open(path, 'r', err => {
      if (err) {
        writeFile(path, '{}', error => {
          if (error) {
            return reject(error);
          }
          return resolve();
        });
      } else {
        resolve();
      }
    });
  });

const langCreator = (req: Request, _: Response, next: NextFunction) => {
  const { lng, ns } = req.params;
  ensureFolderExists(join(localesDir, lng))
    // tslint:disable-next-line:no-console
    .catch(err => console.log('[translations-server] cannot create folder', lng, 'error: ', err))
    .then(() => ensureFileExists(join(localesDir, lng, ns)))
    // tslint:disable-next-line:no-console
    .catch(err => console.log('[translations-server] cannot create file', ns, 'error:', err))
    .then(() => next());
};

function createObj(obj: object, keyPath: string[], value: string) {
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    // tslint:disable-next-line:no-parameter-reassignment
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
  return obj;
}

app.use(cors);

app.get('/locales/:lng/:ns', langCreator);

app.use(
  '/locales',
  express.static(`${join(__dirname, '../../../locales')}`, {
    extensions: ['json'],
  }),
);
app.use(bodyParser.text());
app.post('/locales/:lng/:ns', (req, res) => {
  const { lng, ns } = req.params;
  const body = JSON.parse(req.body);
  const payload = {};
  Object.keys(body).forEach(key => {
    if (key.indexOf('.') > 0) {
      createObj(payload, key.split('.'), body[key]);
    } else {
      payload[key] = body[key];
    }
  });
  const folderPath = join(__dirname, '../../../locales', lng);
  const filePath = join(folderPath, ns);
  Promise.resolve()
    .then(() =>
      lockfile.lock(filePath, {
        retries: {
          factor: 3,
          maxTimeout: 1 * 1000,
          minTimeout: 1 * 1000,
          retries: 5,
        },
      }),
    )
    .then(release => {
      strTrans({ filePath, data: payload })
        .then(writeToFile)
        .then(() => release())
        .then(() => {
          return res.send({ ok: true });
        })
        // tslint:disable-next-line:no-console
        .catch(err => console.error('failed to write to file', err));
    })
    // tslint:disable-next-line:no-console
    .catch(err => console.error('oh no, error', err));
});

const port = 9001;

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('[translations-server] listening on port:', port);
});
