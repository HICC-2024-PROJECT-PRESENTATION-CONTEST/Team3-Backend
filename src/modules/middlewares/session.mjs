import Session from '../session.mjs';

export default (options = {}) => {
  options.name = options.name ? options.name : 'session';
  options.cookie = options.cookie ? options.cookie : {};

  return async (req, res, next) => {
    // 쿠키에서 세션 ID 가져오기
    let uid = req.cookies[options.name];
    let session = new Session(uid);

    // 세션 ID 가 있는 경우
    if (uid) {
      // 저장된 세션 ID 인지 확인
      await session.read().catch((error) => {
        // 저장된 값이 없는 경우, 새로운 세션 대입
        session = new Session();
      });
    }

    // 요청 오브젝트에 세션 data, id 대입
    req.session = session.data;
    req.session.id = session.uid;

    // 세션 저장 함수
    req.session.save = async (maxAge = 0) => {
      const data = JSON.parse(JSON.stringify(req.session));
      delete data.id;
      delete data.save;
      delete data.destroy;
      session.data = data;

      // 세션 ID 쿠키 설정
      const opt = JSON.parse(JSON.stringify(options.cookie));
      if (maxAge == 0) {
        session.expire = new Date(0);
      } else {
        opt.maxAge = maxAge;
        session.expire = new Date(session.creation.getTime() + opt.maxAge);
      }
      res.cookie(options.name, session.uid, opt);

      // 세션 정보 저장
      session.isNew() ? await session.create() : await session.update();
    };

    // 세션 제거 함수
    req.session.destroy = async () => {
      // 세션 ID 쿠키 제거
      const opt = JSON.parse(JSON.stringify(options.cookie));
      opt.expires = new Date(0);
      opt.maxAge = 0;
      res.cookie(options.name, session.uid, opt);

      // 세션 정보 제거
      await session.delete();
    };

    // 만료된 세션인 경우 세션 제거
    if (
      0 < session.expire.getTime() &&
      session.expire.getTime() < new Date().getTime()
    ) {
      await req.session.destroy();
    }

    next();
  };
};
