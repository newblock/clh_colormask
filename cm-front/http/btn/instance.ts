import {config} from '@/config'
import {getInstance} from "@/http/base"

export const instance = getInstance(config.btnServerUrl)