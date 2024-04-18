export const Tasks = {
    SWAP_AND_SYNC_AUDIO: 'SWAP_AND_SYNC_AUDIO',
    CUT_SILENCE: 'CUT_SILENCE',
    ADJUST_VOLUME: 'ADJUST_VOLUME',
    TRANSCRIBE: 'TRANSCRIBE',
}


export type Task = typeof Tasks[keyof typeof Tasks];

export type SubmittedVideo = {
    id: string,
    userId: number,
    videoFile: FileMeta,
    micAudioFile?: FileMeta,
    previewSdUrl?: string,
    previewHdUrl?: string,
    metadata?: {
        originalDuration: number,
        finalDuration?: number,
        width: number,
        height: number,
        rotation: number,
    },
    options: {
        marginBefore?: number,
        marginAfter?: number,
        dbUp?: number,
    }
    tasks: Task[],
    status: 'in_queue' | 'processing' | 'done' | 'error',
    error?: string,
    queuePosition?: number,
    processingStatus?: {
        progress?: number
        currentStatus?: string
        steps?: { step: string, status: 'todo' | 'in_progress' | 'done' }[]
    },
    outputFile?: FileMeta
}


export type PlatformStats = {
    totalVideosProcessed: number,
    totalMinutesProcessed: number,
    totalSilenceMinutesRemoved: number
    totalEditingTimeSavedInMinutes: number,
}

export type SubmitVideoDTO = {
    videoFile: FileMeta
    micAudioFile?: FileMeta
    options: {
        marginBefore?: number,
        marginAfter?: number,
        dbUp?: number,
    }
    tasks: Task[]
}

export type FileMeta = {
    name: string,
    url: string,
}
