import type { OpenNextConfig } from 'open-next/types/open-next.js'
const config = {
  default: { 
    override: { 
      wrapper: "aws-lambda-streaming", // This is necessary to enable lambda streaming
    },
  },
} satisfies OpenNextConfig
 
export default config;
