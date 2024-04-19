# video-processing-backend

### *This is how I did this project...*
![alt text](horse-draw-meme.jpg)

# How to run what I managed to finish:
1. Install docker and bun (bun installation is in run-both.sh)
2. Run `bash ./run-both.sh`
3. Go to http://localhost:5173

# Roadmap
- [x] Auth (UI + Backend) with JWT
- [x] Submit video for processing (UI + Backend)
- [x] View all submitted videos (UI + Backend)
- [x] Implementation of silence removing in python
- [x] Implementation of sync by waveform and swap audio in python
- [x] Implementation of video transcription in python
- [ ] Working video processing with continuous progress update (UI + Backend)
- [ ] Video previews on UI
- [ ] Proper auth with email confirmation
- [ ] Beautiful ui
- [ ] Disk space management (space limiting, show used space by user, videos deletion)
- [ ] Real service stats 
- [ ] Caching layer

# Why didn't achieve the goal
1. Goal quite ambitious for 3 days
2. Stuck for a day with file upload (specifying file limits in express+Bun just doesn't work). It works in Node but I wanted to stuck with Bun
```typescript
// none of this helping...
const GB = 1024 * 1024 * 1024

app.use(express.json({limit: GB})) 
app.use(express.urlencoded({ extended: true, limit: GB }))
app.use(bodyParser.json({limit: GB})) 
app.use(bodyParser.urlencoded({ extended: true, limit: GB }))

const upload = multer({ dest: 'uploads/', limits: {fileSize: GB} })
```
So, finally I just implemented separate server (using Bun.serve) on the separate port for file uploading


# Backend Implementation Notes
0. .env (especially with credentials) should not be commited, but i did this to simplify setup steps on your end
1. DAO layer is omitted for simplicity.
2. Caching layer could be added but omitted for simplicity.
3. Auth token cookie security options could be enhanced but omitted for simplicity.
4. Password strength check could be added but omitted for simplicity.
5. There should be prettier dependency injection
6. For bootstraping flexibility ot was decided to build File download url on UI (in case endpoint will change)
7. Allowing cors was used for debugging purposes, it can be removed in prod. (as way as many other things are not really prod ready here)
8. Remove comments and debugging console logs

# What was an initial idea behind the project?

## Expected user flow
1. Sign up + Sign in
2. Upload video/audio files, specify tasks and task params (e.g. cut silence margin), submit
3. View all submitted videos (their place in processing queue, processing progress...)
4. Be able to download processed video

## Expected implementation
1. Backend puts videos to queue
   * Ideally each task has it's own queue (for different scaling approaches). E.g. transcription is hard task that takes whole cpu/gpu, other tasks not so intensive
   * Also we can play around with dependency graph (tasks execution order) to optimize speed
2. Python microservice processes videos and updates status
   * Files access: both backend and python service should have access to same file storage volume (for speed improvement, to avoid sending files through network)
   * In simple implementation, backend service and python service can share same redis/mongo, so python service will directly update status in db
   * In more proper implementation, python will just send updates to dedicated webhook on backend
3. Why not just Node.js?
   * Most of the tasks could be done from Node.js service, by calling python scripts as child processes, but it will be limiting in terms of future features, also scalability will be not flexible
