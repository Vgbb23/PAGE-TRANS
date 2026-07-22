import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  ArrowRight,
  Zap,
  Check,
  Copy,
  ArrowLeft,
  MapPin,
  User,
  Lock,
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import { OptimizedImage } from './components/OptimizedImage';
import { BrandLogo } from './components/BrandLogo';
import { BRAND, OFFERS, type Offer } from './config/product';

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface PixChargeResult {
  orderId: string;
  pixCode: string;
  qrCodeUrl?: string;
}

interface OrderBump {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

type UtmKey = (typeof UTM_KEYS)[number];
type UtmPayload = Record<UtmKey, string>;

const ORDER_BUMPS: OrderBump[] = [
  {
    id: 'bump-provit-az',
    name: 'AlwaysFit Provit A-Z Multivitamínico',
    description: 'Multivitamínico completo com metilfolato e metilcobalamina — 60 cápsulas para complementar sua rotina diária.',
    price: 24.9,
    image: '/alwaysfit-provit-az.png',
  },
  {
    id: 'bump-nac',
    name: 'AlwaysFit Essencial NAC 600mg',
    description: 'Leve +1 frasco de NAC 600mg — antioxidante premium para complementar sua rotina de bem-estar.',
    price: 23.9,
    image: '/alwaysfit-nac-offer-1.png',
  },
  {
    id: 'bump-pro3-magnesio',
    name: 'AlwaysFit Pro3 Magnésio',
    description: 'Três formas de magnésio (L-Treonina, Dimalato e Quelato) — 60 cápsulas para complementar sua rotina.',
    price: 19.9,
    image: '/alwaysfit-pro3-magnesio.png',
  },
];

const CHECKOUT_REVIEWS = [
  {
    name: 'Marina R.',
    location: 'São Paulo, SP',
    text: 'Produto de ótima qualidade. Embalagem caprichada e fácil de incluir na rotina.',
    images: [] as string[],
  },
  {
    name: 'Felipe A.',
    location: 'Curitiba, PR',
    text: 'Chegou rápido e bem embalado. Já conhecia a Quantum Nutrition e continuei comprando.',
    images: [] as string[],
  },
];

const SHIPPING_DELIVERY_DAYS = {
  free: { min: 10, max: 12 },
  sedex: { min: 2, max: 3 },
} as const;

const addBusinessDays = (from: Date, days: number) => {
  const result = new Date(from);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) added += 1;
  }
  return result;
};

const formatDeliveryDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const getDeliveryEstimate = (method: 'free' | 'sedex') => {
  const { min, max } = SHIPPING_DELIVERY_DAYS[method];
  const today = new Date();
  const label = method === 'free' ? 'Frete Grátis' : 'SEDEX';
  return `Previsão (${label}): ${formatDeliveryDate(addBusinessDays(today, min))} — ${formatDeliveryDate(addBusinessDays(today, max))}`;
};

const previewPixCode = (code: string) => {
  if (code.length <= 72) return code;
  return `${code.slice(0, 40)}…${code.slice(-24)}`;
};

const getShippingDaysLabel = (method: 'free' | 'sedex') => {
  const { min, max } = SHIPPING_DELIVERY_DAYS[method];
  return `${min} a ${max} dias úteis`;
};

type CheckoutStep = 'form' | 'payment';

const CheckoutTrustStrip = () => (
  <div className="bg-slate-900 text-white">
    <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[10px] sm:text-xs font-medium">
      <span className="flex items-center gap-1.5"><Lock size={12} className="text-sky-300" /> Compra segura</span>
      <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-sky-300" /> Garantia 30 dias</span>
      <span className="flex items-center gap-1.5"><Truck size={12} className="text-sky-300" /> Envio para todo Brasil</span>
    </div>
  </div>
);

const CheckoutHeader = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
    <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
      <BrandLogo variant="dark" showSuffix={false} className="h-8 md:h-9 w-auto max-w-[160px]" />
      <div className="flex items-center gap-1.5 text-xs font-semibold text-quantum">
        <Lock size={14} />
        <span className="hidden sm:inline">Ambiente</span> seguro
      </div>
    </div>
    <CheckoutTrustStrip />
  </header>
);

type CheckoutFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

const CheckoutField = ({ label, hint, error, children }: CheckoutFieldProps) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-slate-700">{label}</label>
    {children}
    {hint && !error && <p className="text-[11px] text-slate-500">{hint}</p>}
    {error && <p className="text-[11px] text-red-600">{error}</p>}
  </div>
);

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
    hasError
      ? 'border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-quantum focus:ring-quantum/10'
  }`;

type OrderSummaryProps = {
  offer: Offer;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  shippingMethod: 'free' | 'sedex';
  shippingCost: number;
  orderBumpsPrice: string;
  subtotalPrice: string;
  totalPrice: string;
  compact?: boolean;
  hideProductRow?: boolean;
};

const CheckoutProductBar = ({
  offer,
  quantity,
  setQuantity,
}: {
  offer: Offer;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <OptimizedImage
        src={offer.image}
        alt={offer.name}
        className="w-20 h-20 object-contain shrink-0"
        referrerPolicy="no-referrer"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm text-slate-900 leading-tight">{offer.name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{offer.capsules}</p>
        <p className="text-xs text-quantum font-semibold mt-1">{BRAND.company}</p>
      </div>
      <div className="inline-flex items-center rounded-lg border border-slate-200 overflow-hidden shrink-0">
        <button
          type="button"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="w-8 h-8 text-slate-600 hover:bg-slate-50 transition-colors font-bold"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-900">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((prev) => prev + 1)}
          className="w-8 h-8 text-slate-600 hover:bg-slate-50 transition-colors font-bold"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>
    </div>
  </div>
);

const OrderSummaryCard = ({
  offer,
  quantity,
  setQuantity,
  shippingMethod,
  shippingCost,
  orderBumpsPrice,
  subtotalPrice,
  totalPrice,
  compact = false,
  hideProductRow = false,
}: OrderSummaryProps) => (
  <div className={`bg-white rounded-2xl border border-slate-200 ${compact ? 'p-4' : 'p-5 shadow-sm'}`}>
    {!hideProductRow && (
      <div className={`flex items-start gap-3 ${compact ? '' : 'mb-4 pb-4 border-b border-slate-100'}`}>
        <OptimizedImage
          src={offer.image}
          alt={offer.name}
          className={`object-contain shrink-0 ${compact ? 'w-14 h-14' : 'w-20 h-20'}`}
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm text-slate-900 leading-tight">{offer.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{offer.capsules}</p>
          <p className="text-xs text-quantum font-semibold mt-1">{BRAND.company}</p>
        </div>
        {!compact && (
          <div className="inline-flex items-center rounded-lg border border-slate-200 overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 text-slate-600 hover:bg-slate-50 transition-colors font-bold"
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-900">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 text-slate-600 hover:bg-slate-50 transition-colors font-bold"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        )}
      </div>
    )}

    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-slate-600">
        <span>Subtotal ({quantity}x)</span>
        <span className="font-semibold text-slate-900">R$ {subtotalPrice}</span>
      </div>
      <div className="flex justify-between text-slate-600">
        <span>Frete</span>
        <span className={`font-semibold ${shippingMethod === 'free' ? 'text-quantum' : 'text-slate-900'}`}>
          {shippingMethod === 'free' ? 'Grátis' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
        </span>
      </div>
      {parseFloat(orderBumpsPrice.replace(',', '.')) > 0 && (
        <div className="flex justify-between text-slate-600">
          <span>Adicionais</span>
          <span className="font-semibold text-slate-900">R$ {orderBumpsPrice}</span>
        </div>
      )}
      <div className="flex justify-between items-baseline pt-3 border-t border-slate-100">
        <span className="font-display font-bold text-slate-900">Total</span>
        <span className="font-display text-2xl font-bold text-quantum">R$ {totalPrice}</span>
      </div>
    </div>

    {!compact && (
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Truck size={12} className="text-quantum shrink-0" />
          {getDeliveryEstimate(shippingMethod)}
        </p>
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-quantum shrink-0" />
          Suplemento regularizado • Não é medicamento
        </p>
      </div>
    )}
  </div>
);

const CheckoutTestimonials = () => (
  <div className="grid sm:grid-cols-2 gap-3">
    {CHECKOUT_REVIEWS.map((review) => (
      <div key={review.name} className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex gap-0.5 text-amber-400 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={11} fill="currentColor" />
          ))}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-2">&ldquo;{review.text}&rdquo;</p>
        <p className="text-xs font-semibold text-slate-900">{review.name}</p>
        <p className="text-[10px] text-slate-500">{review.location}</p>
        {review.images.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {review.images.map((src) => (
              <OptimizedImage key={src} src={src} alt="" className="h-10 w-10 rounded-md object-cover border border-slate-100" />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

const CheckoutFooter = () => (
  <footer className="pt-4 border-t border-slate-200 text-center">
    <p className="text-[10px] text-slate-500 leading-relaxed max-w-md mx-auto">
      {BRAND.company} — Suplemento alimentar. Não substitui orientação médica ou nutricional.
      Seus dados são utilizados apenas para processar o pedido e envio.
    </p>
  </footer>
);

const PixIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
    <path d="M11.917 11.71a2.046 2.046 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.044 2.044 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668h-.253zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.044 2.044 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z" />
    <path d="m14.377 6.496-1.612-1.612a.307.307 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.448 1.448 0 0 0-1.018-.422h-.9a.306.306 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.305.305 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733c.04 0 .079.01.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z" />
  </svg>
);

/** Compacta dados do checkout para o upsell (base64url). O upsell decodifica e gera PIX sem depender da API de pedido. */
const encodeUpsellCustomerPrefill = (payload: {n: string; e: string; p: string; c: string}) => {
  const raw = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(raw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const scrollPageToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const Checkout = ({ offer, onBack }: { offer: Offer; onBack: () => void }) => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [shippingMethod, setShippingMethod] = useState<'free' | 'sedex'>('free');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ cpf: '', cep: '' });
  const [touchedFields, setTouchedFields] = useState({ cpf: false, cep: false });
  const [cepLookupError, setCepLookupError] = useState('');
  const [isCreatingPixCharge, setIsCreatingPixCharge] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [pixCharge, setPixCharge] = useState<PixChargeResult | null>(null);
  const [isPixCopied, setIsPixCopied] = useState(false);
  const [isPaymentApproved, setIsPaymentApproved] = useState(false);
  const [selectedOrderBumps, setSelectedOrderBumps] = useState<string[]>([]);
  const hasRedirectedAfterPayment = useRef(false);

  useLayoutEffect(() => {
    scrollPageToTop();
  }, [step]);

  const unitPrice = parseFloat(offer.price.replace(',', '.'));
  const subtotal = unitPrice * quantity;
  const shippingCost = shippingMethod === 'sedex' ? 12.84 : 0;
  const orderBumpsTotal = ORDER_BUMPS
    .filter((bump) => selectedOrderBumps.includes(bump.id))
    .reduce((sum, bump) => sum + bump.price, 0);
  const totalPrice = (subtotal + shippingCost + orderBumpsTotal).toFixed(2).replace('.', ',');
  const subtotalPrice = subtotal.toFixed(2).replace('.', ',');
  const orderBumpsPrice = orderBumpsTotal.toFixed(2).replace('.', ',');

  const toggleOrderBump = (id: string) => {
    setSelectedOrderBumps((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));
  };

  const getUtmPayload = (): UtmPayload => {
    const searchParams = new URLSearchParams(window.location.search);
    const utm: Partial<UtmPayload> = {};

    UTM_KEYS.forEach((key) => {
      const valueFromUrl = searchParams.get(key)?.trim() ?? '';
      const storageKey = `utmify:${key}`;
      const valueFromStorage = sessionStorage.getItem(storageKey)?.trim() ?? '';
      const finalValue = valueFromUrl || valueFromStorage || '';

      if (valueFromUrl) {
        sessionStorage.setItem(storageKey, valueFromUrl);
      }

      utm[key] = finalValue;
    });

    return utm as UtmPayload;
  };

  const normalizePhone = (phoneValue: string) => {
    const digits = phoneValue.replace(/\D/g, '');
    return digits.startsWith('55') ? digits : `55${digits}`;
  };

  const getPixPayloadFromResponse = (payload: any): PixChargeResult | null => {
    if (!payload?.data) return null;
    const data = payload.data;
    const pixData = data.pix ?? {};

    const pickString = (...values: unknown[]) => {
      const firstValid = values.find((value) => typeof value === 'string' && value.trim().length > 0);
      return typeof firstValid === 'string' ? firstValid : '';
    };

    const pixCode = pickString(
      pixData.copy_paste,
      pixData.copyPaste,
      pixData.emv,
      pixData.payload,
      pixData.code,
      data.copy_paste,
      data.copyPaste,
      data.emv,
      data.payload,
      data.code
    );

    let qrCodeUrl = pickString(
      pixData.qr_code,
      pixData.qrCode,
      pixData.qrcode,
      data.qr_code,
      data.qrCode,
      data.qrcode
    );

    if (qrCodeUrl && !qrCodeUrl.startsWith('http') && !qrCodeUrl.startsWith('data:image')) {
      qrCodeUrl = `data:image/png;base64,${qrCodeUrl}`;
    }

    if (!pixCode) return null;

    return {
      orderId: data.order_id ?? data.orderId ?? '',
      pixCode,
      qrCodeUrl,
    };
  };

  const createPixCharge = async () => {
    setIsCreatingPixCharge(true);
    setPaymentError('');
    setIsPaymentApproved(false);
    hasRedirectedAfterPayment.current = false;

    try {
      const utm = getUtmPayload();

      const response = await fetch('/api/pix/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: normalizePhone(formData.phone),
          cpf: formData.cpf.replace(/\D/g, ''),
          itemValue: Math.round(unitPrice * 100),
          quantity,
          shippingValue: Math.round(shippingCost * 100),
          orderBumpsValue: Math.round(orderBumpsTotal * 100),
          subtotalValue: Math.round(subtotal * 100),
          totalValue: Math.round((subtotal + shippingCost + orderBumpsTotal) * 100),
          utm,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message ?? 'Não foi possível criar a cobrança PIX.');
      }

      const pixData = getPixPayloadFromResponse(result);
      if (!pixData) {
        throw new Error('Cobrança criada, mas os dados PIX não foram retornados pela API.');
      }

      setPixCharge(pixData);
      return true;
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Erro ao criar pagamento PIX.');
      return false;
    } finally {
      setIsCreatingPixCharge(false);
    }
  };

  const validateCpf = (cpfValue: string) => {
    const cpf = cpfValue.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
    let firstCheckDigit = (sum * 10) % 11;
    if (firstCheckDigit === 10) firstCheckDigit = 0;
    if (firstCheckDigit !== Number(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
    let secondCheckDigit = (sum * 10) % 11;
    if (secondCheckDigit === 10) secondCheckDigit = 0;
    return secondCheckDigit === Number(cpf[10]);
  };

  const validateCep = (cepValue: string) => {
    const cep = cepValue.replace(/\D/g, '');
    return cep.length === 8;
  };

  // Fetch address from ViaCEP when CEP is valid
  useEffect(() => {
    getUtmPayload();
  }, []);

  useEffect(() => {
    const cep = formData.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      const fetchAddress = async () => {
        setIsFetchingCep(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setCepLookupError('');
            setFieldErrors(prev => ({ ...prev, cep: '' }));
            setFormData(prev => ({
              ...prev,
              address: data.logradouro || prev.address,
              neighborhood: data.bairro || prev.neighborhood,
              city: data.localidade || prev.city,
              state: data.uf || prev.state,
            }));
            // Focus on number field after filling address
            const numberInput = document.getElementsByName('number')[0] as HTMLInputElement;
            if (numberInput) numberInput.focus();
          } else {
            const message = 'CEP inválido. Confira o número.';
            setCepLookupError(message);
            setFieldErrors(prev => ({ ...prev, cep: message }));
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          const message = 'CEP inválido. Confira o número.';
          setCepLookupError(message);
          setFieldErrors(prev => ({ ...prev, cep: message }));
        } finally {
          setIsFetchingCep(false);
        }
      };
      fetchAddress();
    } else {
      setCepLookupError('');
      setFieldErrors(prev => ({ ...prev, cep: '' }));
    }
  }, [formData.cep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cep') {
      formattedValue = value.replace(/\D/g, '').slice(0, 8);
      if (formattedValue.length > 5) {
        formattedValue = `${formattedValue.slice(0, 5)}-${formattedValue.slice(5)}`;
      }
      if (formattedValue.replace(/\D/g, '').length === 8) {
        setTouchedFields(prev => ({ ...prev, cep: true }));
      }
    } else if (name === 'cpf') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
      if (formattedValue.length > 9) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3, 6)}.${formattedValue.slice(6, 9)}-${formattedValue.slice(9)}`;
      } else if (formattedValue.length > 6) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3, 6)}.${formattedValue.slice(6)}`;
      } else if (formattedValue.length > 3) {
        formattedValue = `${formattedValue.slice(0, 3)}.${formattedValue.slice(3)}`;
      }
    } else if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').slice(0, 11);
      if (formattedValue.length > 10) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 7)}-${formattedValue.slice(7)}`;
      } else if (formattedValue.length > 6) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2, 6)}-${formattedValue.slice(6)}`;
      } else if (formattedValue.length > 2) {
        formattedValue = `(${formattedValue.slice(0, 2)}) ${formattedValue.slice(2)}`;
      } else if (formattedValue.length > 0) {
        formattedValue = `(${formattedValue}`;
      }
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    if (name === 'cpf' && touchedFields.cpf) {
      setFieldErrors(prev => ({
        ...prev,
        cpf: validateCpf(formattedValue) ? '' : 'CPF inválido. Confira os números.',
      }));
    }

    if (name === 'cep' && touchedFields.cep) {
      setCepLookupError('');
      setFieldErrors(prev => ({
        ...prev,
        cep: validateCep(formattedValue) ? '' : 'CEP inválido. Use o formato 00000-000.',
      }));
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      setTouchedFields(prev => ({ ...prev, cpf: true }));
      setFieldErrors(prev => ({
        ...prev,
        cpf: validateCpf(value) ? '' : 'CPF inválido. Confira os números.',
      }));
    }

    if (name === 'cep') {
      setTouchedFields(prev => ({ ...prev, cep: true }));
      setFieldErrors(prev => ({
        ...prev,
        cep: !validateCep(value)
          ? 'CEP inválido. Use o formato 00000-000.'
          : cepLookupError,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfError = validateCpf(formData.cpf) ? '' : 'CPF inválido. Confira os números.';
    const cepError = !validateCep(formData.cep)
      ? 'CEP inválido. Use o formato 00000-000.'
      : isFetchingCep
        ? 'Aguarde a validação do CEP.'
        : cepLookupError;

    setTouchedFields({ cpf: true, cep: true });
    setFieldErrors({ cpf: cpfError, cep: cepError });

    if (cpfError || cepError) return;

    const isPixReady = await createPixCharge();
    if (!isPixReady) return;

    setStep('payment');
  };

  const copyPixCode = async () => {
    if (!pixCharge?.pixCode) {
      setPaymentError('Código PIX indisponível.');
      return;
    }
    try {
      await navigator.clipboard.writeText(pixCharge.pixCode);
      setIsPixCopied(true);
      setTimeout(() => setIsPixCopied(false), 2500);
    } catch {
      setPaymentError('Não foi possível copiar o código PIX.');
    }
  };

  useEffect(() => {
    if (step !== 'payment' || !pixCharge?.orderId || hasRedirectedAfterPayment.current) {
      return undefined;
    }

    let isCancelled = false;

    const checkOrderStatus = async () => {
      if (isCancelled || hasRedirectedAfterPayment.current) return;

      try {
        const response = await fetch(`/api/order/${encodeURIComponent(pixCharge.orderId)}`, {
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) return;

        const orderResponse = await response.json();
        const paidAt = orderResponse?.data?.paid_at ?? orderResponse?.paid_at ?? null;
        if (paidAt) {
          hasRedirectedAfterPayment.current = true;
          setIsPaymentApproved(true);
          window.setTimeout(() => {
            const nextUrl = new URL('https://upselltesto.vercel.app/');
            const params = new URLSearchParams(window.location.search);
            params.set('orderId', pixCharge.orderId);
            try {
              params.set(
                'prefill',
                encodeUpsellCustomerPrefill({
                  n: formData.name.trim(),
                  e: formData.email.trim(),
                  p: normalizePhone(formData.phone),
                  c: formData.cpf.replace(/\D/g, ''),
                })
              );
            } catch {
              // segue só com orderId
            }
            nextUrl.search = params.toString();
            window.location.href = nextUrl.toString();
          }, 1200);
        }
      } catch {
        // Ignora falhas momentâneas no polling para tentar novamente no próximo ciclo.
      }
    };

    checkOrderStatus();
    const intervalId = window.setInterval(checkOrderStatus, 300);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [step, pixCharge?.orderId]);

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <CheckoutHeader />
        <div className="max-w-lg mx-auto px-4 py-6">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={18} /> Voltar
          </button>

          <OrderSummaryCard
            offer={offer}
            quantity={quantity}
            setQuantity={setQuantity}
            shippingMethod={shippingMethod}
            shippingCost={shippingCost}
            orderBumpsPrice={orderBumpsPrice}
            subtotalPrice={subtotalPrice}
            totalPrice={totalPrice}
            compact
          />

          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full mb-4">
                <PixIcon className="h-7 w-7" />
              </div>

              <h2 className="font-display text-xl font-bold text-slate-900 mb-1">Pague com PIX</h2>
              <p className="text-sm text-slate-500 mb-5">
                Copie o código e cole no app do seu banco para confirmar o pedido.
              </p>

              <div className="bg-slate-50 rounded-xl px-4 py-3 mb-5">
                <p className={`text-xs font-semibold ${isPaymentApproved ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {isPaymentApproved ? 'Pagamento confirmado!' : 'Aguardando pagamento...'}
                </p>
                {pixCharge?.orderId && (
                  <p className="text-[10px] text-slate-400 mt-1">Pedido #{pixCharge.orderId.slice(0, 8)}</p>
                )}
              </div>
            </div>

            {isPaymentApproved && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700 text-center">
                Redirecionando...
              </div>
            )}

            <div className="mb-5 text-left rounded-xl bg-quantum/5 border border-quantum/15 p-4">
              <p className="text-xs font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
                <Zap size={13} className="text-quantum" /> Como pagar
              </p>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal ml-4">
                <li>Abra o aplicativo do seu banco</li>
                <li>Escolha a opção <span className="font-semibold text-slate-800">PIX Copia e Cola</span></li>
                <li>Cole o código PIX copiado nesta página</li>
                <li>Confirme o valor e finalize o pagamento</li>
              </ol>
            </div>

            <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
                Código PIX
              </p>
              <p className="font-mono text-[11px] leading-relaxed text-slate-700 break-all select-all">
                {pixCharge?.pixCode ? previewPixCode(pixCharge.pixCode) : '—'}
              </p>
            </div>

            <button
              type="button"
              onClick={copyPixCode}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isPixCopied ? 'bg-emerald-600 text-white' : 'btn-primary'
              }`}
            >
              <Copy size={16} />
              {isPixCopied ? 'Código copiado!' : 'Copiar código PIX'}
            </button>

            {paymentError && <p className="mt-4 text-xs text-red-600 font-semibold text-center">{paymentError}</p>}

            <p className="mt-5 text-[11px] text-slate-400 text-center">
              O código de rastreio será enviado para {formData.email || 'seu e-mail'} após a confirmação.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <CheckoutHeader />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 mb-6 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={18} /> Voltar para as ofertas
        </button>

        <CheckoutProductBar offer={offer} quantity={quantity} setQuantity={setQuantity} />

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 mt-6">
          <div className="lg:col-span-3 space-y-5">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
              <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
                <h2 className="font-display text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <User size={18} className="text-quantum" />
                  Dados pessoais
                </h2>
                <div className="grid gap-4">
                  <CheckoutField label="Nome completo">
                    <input
                      required
                      name="name"
                      className={inputClass()}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </CheckoutField>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <CheckoutField label="E-mail" hint="Enviaremos o rastreio para este e-mail">
                      <input
                        required
                        type="email"
                        name="email"
                        className={inputClass()}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </CheckoutField>
                    <CheckoutField label="WhatsApp" hint="Com DDD">
                      <input
                        required
                        name="phone"
                        className={inputClass()}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </CheckoutField>
                  </div>
                  <CheckoutField label="CPF" hint="Necessário para emissão do pedido" error={fieldErrors.cpf}>
                    <input
                      required
                      name="cpf"
                      className={inputClass(!!fieldErrors.cpf)}
                      value={formData.cpf}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                    />
                  </CheckoutField>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
                <h2 className="font-display text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-quantum" />
                  Endereço de entrega
                </h2>
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <CheckoutField label="CEP" error={fieldErrors.cep}>
                      <div className="relative">
                        <input
                          required
                          name="cep"
                          className={`${inputClass(!!fieldErrors.cep)} ${isFetchingCep ? 'opacity-60' : ''}`}
                          value={formData.cep}
                          onChange={handleInputChange}
                          onBlur={handleFieldBlur}
                        />
                        {isFetchingCep && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-quantum border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    </CheckoutField>
                    <CheckoutField label="Cidade">
                      <input required name="city" className={inputClass()} value={formData.city} onChange={handleInputChange} />
                    </CheckoutField>
                  </div>
                  <CheckoutField label="Endereço">
                    <input required name="address" className={inputClass()} value={formData.address} onChange={handleInputChange} />
                  </CheckoutField>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <CheckoutField label="Número">
                      <input required name="number" className={inputClass()} value={formData.number} onChange={handleInputChange} />
                    </CheckoutField>
                    <CheckoutField label="Complemento" hint="Opcional">
                      <input name="complement" className={inputClass()} value={formData.complement} onChange={handleInputChange} />
                    </CheckoutField>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <CheckoutField label="Bairro">
                      <input required name="neighborhood" className={inputClass()} value={formData.neighborhood} onChange={handleInputChange} />
                    </CheckoutField>
                    <CheckoutField label="Estado (UF)">
                      <input required name="state" className={inputClass()} value={formData.state} onChange={handleInputChange} />
                    </CheckoutField>
                  </div>
                </div>
              </section>

              {formData.cep.replace(/\D/g, '').length >= 8 && (
                <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
                  <h2 className="font-display text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Truck size={18} className="text-quantum" />
                    Forma de entrega
                  </h2>
                  <div className="grid gap-3">
                    {([
                      { id: 'free' as const, title: 'Frete Grátis', days: getShippingDaysLabel('free'), price: 'Grátis', highlight: true },
                      { id: 'sedex' as const, title: 'SEDEX', days: getShippingDaysLabel('sedex'), price: 'R$ 12,84', highlight: false },
                    ]).map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setShippingMethod(option.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                          shippingMethod === option.id
                            ? 'border-quantum bg-quantum/5'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-5 w-5 rounded-full border-2 items-center justify-center ${
                            shippingMethod === option.id ? 'border-quantum' : 'border-slate-300'
                          }`}>
                            {shippingMethod === option.id && <span className="h-2.5 w-2.5 rounded-full bg-quantum" />}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                            <p className="text-xs text-slate-500">{option.days}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${option.highlight && shippingMethod === option.id ? 'text-quantum' : 'text-slate-800'}`}>
                          {option.price}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p key={shippingMethod} className="mt-3 text-xs text-quantum font-medium">
                    {getDeliveryEstimate(shippingMethod)}
                  </p>
                </section>
              )}

              <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
                <h2 className="font-display text-base font-bold text-slate-900 mb-4">Pagamento</h2>
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-quantum bg-quantum/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <PixIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">PIX — Aprovação imediata</p>
                      <p className="text-xs text-slate-500">Confirmação automática após o pagamento</p>
                    </div>
                  </div>
                  <Check size={18} className="text-quantum shrink-0" />
                </div>
              </section>

              {ORDER_BUMPS.length > 0 && (
                <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm">
                  <h2 className="font-display text-base font-bold text-slate-900 mb-1">Ofertas especiais</h2>
                  <p className="text-xs text-slate-500 mb-4">Aproveite e leve mais por menos</p>
                  <div className="space-y-3">
                    {ORDER_BUMPS.map((bump) => {
                      const isSelected = selectedOrderBumps.includes(bump.id);
                      return (
                        <button
                          key={bump.id}
                          type="button"
                          onClick={() => toggleOrderBump(bump.id)}
                          className={`w-full text-left rounded-xl border p-3 transition-all ${
                            isSelected ? 'border-quantum bg-quantum/5' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              isSelected ? 'border-quantum bg-quantum text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check size={12} />}
                            </span>
                            <OptimizedImage src={bump.image} alt={bump.name} className="w-12 h-12 rounded-lg object-contain border border-slate-100" referrerPolicy="no-referrer" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900">{bump.name}</p>
                              <p className="text-xs text-slate-500 line-clamp-2">{bump.description}</p>
                            </div>
                            <span className="text-sm font-bold text-quantum shrink-0">
                              + R$ {bump.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-[180px] space-y-4">
              <OrderSummaryCard
                offer={offer}
                quantity={quantity}
                setQuantity={setQuantity}
                shippingMethod={shippingMethod}
                shippingCost={shippingCost}
                orderBumpsPrice={orderBumpsPrice}
                subtotalPrice={subtotalPrice}
                totalPrice={totalPrice}
                hideProductRow
              />

              <div className="space-y-2">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isCreatingPixCharge}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isCreatingPixCharge ? 'Gerando PIX...' : 'Finalizar pedido'}
                  {!isCreatingPixCharge && <ArrowRight size={18} />}
                </button>
                {paymentError && <p className="text-xs text-red-600 font-semibold text-center">{paymentError}</p>}
              </div>

              <CheckoutFooter />

              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quem já comprou</p>
                <CheckoutTestimonials />
              </div>

              <div className="hidden lg:grid grid-cols-3 gap-2">
                {[
                  { icon: Lock, label: 'Dados protegidos' },
                  { icon: ShieldCheck, label: 'Garantia 30 dias' },
                  { icon: Truck, label: 'Envio rastreado' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
                    <item.icon size={16} className="text-quantum mx-auto mb-1.5" />
                    <p className="text-[9px] font-semibold text-slate-600 leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function App() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useLayoutEffect(() => {
    if (selectedOffer) {
      scrollPageToTop();
    }
  }, [selectedOffer]);

  const handleSelectOffer = (offer: Offer) => {
    scrollPageToTop();
    setSelectedOffer(offer);
  };

  const handleBackFromCheckout = () => {
    setSelectedOffer(null);
    requestAnimationFrame(scrollPageToTop);
  };

  if (selectedOffer) {
    return (
      <div className="checkout-theme">
        <Checkout offer={selectedOffer} onBack={handleBackFromCheckout} />
      </div>
    );
  }

  return <LandingPage onSelectOffer={handleSelectOffer} />;
}
