export function getDongleID(pathname) {
  let parts = pathname.split('/');
  parts = parts.filter((m) => m.length);

  if (parts[0] === 'auth') {
    return null;
  }

  return parts[0] || null;
}

export function getZoom(pathname) {
  let parts = pathname.split('/');
  parts = parts.filter((m) => m.length);

  if (parts.length >= 3 && parts[0] !== 'auth' && parts[1] !== 'prime') {
    return {
      start: Number(parts[1]),
      end: Number(parts[2])
    };
  }
  return {
    start: null,
    end: null
  };
}

export function getPrimeNav(pathname) {
  let parts = pathname.split('/');
  parts = parts.filter((m) => m.length);

  if (parts.length >= 3 && parts[0] !== 'auth' && parts[1] === 'prime') {
    return parts[2];
  }
  return null;
}
