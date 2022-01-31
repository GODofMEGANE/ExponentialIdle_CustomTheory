import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "my_custom_theory_id";
var name = "Goldbach's conjecture";
var description = "ゴールドバッハ予想を使った理論です\nnを二つの素数の和で表すことで\nnを増加させることができます\n出版は最初から購入可能なので直ぐに買おう";
var authors = "GODofMEGANE";
var version = 1;

var currency;
var n, p1, p2;
var mile_1;

var alwaysShowRefundButtons = () => true;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // n
    {
        let getDesc = (level) => "n=" + (2*level+4);
        n = theory.createUpgrade(0, currency, new ExponentialCost(1, 0));
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount));
        n.boughtOrRefunded = (_) => theory.invalidateTertiaryEquation();
    }

    // p_1
    {
        let getDesc = (level) => "i=" + (level+1);
        let getInfo = (level) => "i=" + getp1(level).toString(0);
        p1 = theory.createUpgrade(1, currency, new FreeCost());
        p1.getDescription = (_) => Utils.getMath(getDesc(p1.level));
        p1.getInfo = (amount) => Utils.getMathTo(getDesc(p1.level), getDesc(p1.level + amount));
        p1.boughtOrRefunded = (_) => theory.invalidateTertiaryEquation();
    }

    // p_2
    {
        let getDesc = (level) => "j=" + (level+1);
        let getInfo = (level) => "j=" + getp1(level).toString(0);
        p2 = theory.createUpgrade(2, currency, new FreeCost());
        p2.getDescription = (_) => Utils.getMath(getDesc(p2.level));
        p2.getInfo = (amount) => Utils.getMathTo(getDesc(p2.level), getDesc(p2.level + amount));
        p2.boughtOrRefunded = (_) => theory.invalidateTertiaryEquation();
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 0);
    //theory.createBuyAllUpgrade(1, currency, 1e13);
    //theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(2, 100));

    {
        mile_1 = theory.createMilestoneUpgrade(0, 1);
        mile_1.description = "+Info";
        mile_1.info = "It show sum of two primes";
        mile_1.boughtOrRefunded = (_) => theory.invalidateTertiaryEquation();
    }
    updateAvailability();
}

var updateAvailability = () => {
    mile_1.isAvailable = true;
}

var tick = (elapsedTime, multiplier) => {
    currency.value = 1/(Math.abs( getn(n.level) - (findPrime(getp1(p1.level))+findPrime(getp2(p2.level))) ) +1);
}

var getPrimaryEquation = () => {
    let result = "\\rho = \\frac{1}{|n-(P_i+P_j)|+1}";
    return result;
}

var getSecondaryEquation = () => "P_N=Nth Prime, " + theory.latexSymbol + "=n-4";
var getTertiaryEquation = () => {
    if(mile_1.level == 1) return ("P_i="+findPrime(getp1(p1.level))+", P_j="+findPrime(getp2(p2.level))+", P_i+P_j="+(findPrime(getp1(p1.level))+findPrime(getp2(p2.level))));
    else return ("P_i="+findPrime(getp1(p1.level))+", P_j="+findPrime(getp2(p2.level)));
}
var getPublicationMultiplier = (tau) => tau.pow(0.3) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.3}}{3}";
var getTau = () => (getn(n.level)-4) * theory.publicationMultiplier;
var get2DGraphValue = () => (findPrime(getp1(p1.level))+findPrime(getp2(p2.level)));

var getn = (level) => 2*level+4;
var getp1 = (level) => level+1;
var getp2 = (level) => level+1;


var findPrime = (num) => {
    if(num == 1){
        return 2;
    }
    var prime_num = 2;
    for(var now_num = 3;;now_num+=2){
        var prime_flag = true;
        for(var check_num = 3;check_num*check_num<=now_num;check_num+=2){
            if(now_num%check_num==0){
                prime_flag = false;
                break;
            }
        }
        if(prime_flag){
            if(num == prime_num){
                return now_num;
            }
            prime_num++;
        }
    }
}


init();