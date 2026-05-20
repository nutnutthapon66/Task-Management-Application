import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(duration)
dayjs.extend(utc)

export default dayjs
