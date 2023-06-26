import * as IP from 'request-ip';
import * as ipdb from "ipip-ipdb"
import { dirname, join, resolve } from 'path';

const IpHandler = new ipdb.City(join(__dirname, "../../public/ipdb.ipdb"))

export const getIp = (req: unknown) => {
    const ip = IP.getClientIp(req);
    let ipv4;
    let ipv6;
    if(ip.lastIndexOf(":") != -1){
        ipv4 = ip.substring(ip.lastIndexOf(":") + 1);
        ipv6 = ip.substring(0, ip.lastIndexOf(":"));
    }else{
        ipv4 = ip;
    }
    return {
        ipv4,
        ipv6
    };
}

export const getLocation = (ip: string) =>{
    return IpHandler.findMap(ip, "CN")
}