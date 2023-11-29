export const iosChecker = (userAgent: string): boolean=> {
  const isIOS = userAgent.match(/CPU OS (\d+)/);
  return isIOS ? parseInt(isIOS[1], 10) > 6:  false; 
}